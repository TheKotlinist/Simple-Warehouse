import pool from '../config/database.js';

export const getAllKategori = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_kategori,
        nama_kategori
      FROM kategori
      WHERE is_active = TRUE
      ORDER BY id_kategori;
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('GET KATEGORI ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil data kategori'
    });
  }
};


export const getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        id_kategori,
        nama_kategori
      FROM kategori
      WHERE id_kategori = $1
        AND is_active = TRUE;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('GET KATEGORI BY ID ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil kategori'
    });
  }
};


export const createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({
        message: 'Nama kategori wajib diisi'
      });
    }

    const result = await pool.query(`
      INSERT INTO kategori (nama_kategori)
      VALUES ($1)
      RETURNING *;
    `, [nama_kategori]);

    res.status(201).json({
      message: 'Kategori berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('CREATE KATEGORI ERROR:', error);

    res.status(500).json({
      message: 'Gagal menambahkan kategori'
    });
  }
};


export const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({
        message: 'Nama kategori wajib diisi'
      });
    }

    const result = await pool.query(`
      UPDATE kategori
      SET nama_kategori = $1
      WHERE id_kategori = $2
      RETURNING *;
    `, [
      nama_kategori,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan'
      });
    }

    res.json({
      message: 'Kategori berhasil diperbarui',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('UPDATE KATEGORI ERROR:', error);

    res.status(500).json({
      message: 'Gagal memperbarui kategori'
    });
  }
};


export const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE kategori
      SET is_active = FALSE
      WHERE id_kategori = $1
        AND is_active = TRUE
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json({
      message: 'Kategori berhasil dinonaktifkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('DELETE KATEGORI ERROR:', error);

    res.status(500).json({
      message: 'Gagal menonaktifkan kategori'
    });
  }
};