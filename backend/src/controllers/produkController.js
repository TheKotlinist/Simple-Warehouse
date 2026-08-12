import pool from '../config/database.js';

export const getAllProduk = async (req, res) => {
  try {
    const { search } = req.query;

    // benerin query untuk join tabel kategori dan lokasi_rak
    let query = `
      SELECT
        p.id_produk,
        p.sku,
        p.nama_produk,
        p.satuan,
        p.stok_saat_ini,
        p.stok_minimum,
        k.nama_kategori,
        r.kode_rak
      FROM produk p
      JOIN kategori k
        ON p.id_kategori = k.id_kategori
      JOIN lokasi_rak r
        ON p.id_lokasi = r.id_lokasi
      WHERE p.is_active = TRUE
    `;

    const values = [];

    if (search) {
      query += `
        AND (
          p.nama_produk ILIKE $1
          OR p.sku ILIKE $1
        )
      `;

      values.push(`%${search}%`);
    }

    query += `
      ORDER BY p.id_produk;
    `;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error('GET PRODUK ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil data produk'
    });
  }
};

export const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        p.id_produk,
        p.sku,
        p.nama_produk,
        p.satuan,
        p.stok_saat_ini,
        p.stok_minimum,
        k.id_kategori,
        k.nama_kategori,
        r.id_lokasi,
        r.kode_rak
      FROM produk p
      JOIN kategori k
        ON p.id_kategori = k.id_kategori
      JOIN lokasi_rak r
        ON p.id_lokasi = r.id_lokasi
      WHERE p.id_produk = $1;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('GET PRODUK BY ID ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil detail produk'
    });
  }
};

export const createProduk = async (req, res) => {
  try {
    const {
      sku,
      nama_produk,
      satuan,
      stok_minimum,
      id_kategori,
      id_lokasi
    } = req.body;

    
    if (
      !sku ||
      !nama_produk ||
      !satuan ||
      stok_minimum === undefined ||
      !id_kategori ||
      !id_lokasi
    ) {
      return res.status(400).json({
        message: 'Data produk belum lengkap'
      });
    }

    const result = await pool.query(`
      INSERT INTO produk
      (
        sku,
        nama_produk,
        satuan,
        stok_saat_ini,
        stok_minimum,
        id_kategori,
        id_lokasi
      )
      VALUES ($1, $2, $3, 0, $4, $5, $6)
      RETURNING *;
    `, [
      sku,
      nama_produk,
      satuan,
      stok_minimum,
      id_kategori,
      id_lokasi
    ]);

    res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('CREATE PRODUK ERROR:', error);

    res.status(500).json({
      message: 'Gagal menambahkan produk'
    });
  }
};

export const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      sku,
      nama_produk,
      satuan,
      stok_minimum,
      id_kategori,
      id_lokasi
    } = req.body;

    if (
      !sku ||
      !nama_produk ||
      !satuan ||
      stok_minimum === undefined ||
      !id_kategori ||
      !id_lokasi
    ) {
      return res.status(400).json({
        message: 'Data produk belum lengkap'
      });
    }

    const result = await pool.query(`
      UPDATE produk
      SET
        sku = $1,
        nama_produk = $2,
        satuan = $3,
        stok_minimum = $4,
        id_kategori = $5,
        id_lokasi = $6
      WHERE id_produk = $7
      RETURNING *;
    `, [
      sku,
      nama_produk,
      satuan,
      stok_minimum,
      id_kategori,
      id_lokasi,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      message: 'Produk berhasil diperbarui',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('UPDATE PRODUK ERROR:', error);

    res.status(500).json({
      message: 'Gagal memperbarui produk'
    });
  }
};

export const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE produk
      SET is_active = FALSE
      WHERE id_produk = $1
        AND is_active = TRUE
      RETURNING
        id_produk,
        sku,
        nama_produk,
        is_active;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json({
      message: 'Produk berhasil dinonaktifkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('DELETE PRODUK ERROR:', error);

    res.status(500).json({
      message: 'Gagal menonaktifkan produk'
    });
  }
};