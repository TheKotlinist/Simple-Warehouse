import pool from '../config/database.js';

export const createBarangMasuk = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      no_dokumen,
      tanggal,
      keterangan,
      id_supplier,
      id_pengguna,
      items
    } = req.body;

    // =========================
    // VALIDASI REQUEST
    // =========================

    if (
      !no_dokumen ||
      !id_supplier ||
      !id_pengguna ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: 'Data transaksi belum lengkap'
      });
    }

    // =========================
    // MULAI DATABASE TRANSACTION
    // =========================

    await client.query('BEGIN');

    // =========================
    // 1. INSERT TRANSAKSI_STOK
    // =========================

    const transaksiResult = await client.query(`
      INSERT INTO transaksi_stok
      (
        no_dokumen,
        tipe_transaksi,
        tanggal,
        keterangan,
        id_supplier,
        id_pengguna
      )
      VALUES ($1, 'masuk', COALESCE($2, CURRENT_TIMESTAMP), $3, $4, $5)
      RETURNING *;
    `, [
      no_dokumen,
      tanggal || null,
      keterangan || null,
      id_supplier,
      id_pengguna
    ]);

    const transaksi = transaksiResult.rows[0];

    // =========================
    // 2. INSERT DETAIL + UPDATE STOK
    // =========================

    for (const item of items) {
      const {
        id_produk,
        jumlah,
        harga_satuan
      } = item;

      if (!id_produk || !jumlah || jumlah <= 0) {
        throw new Error('Data produk dalam transaksi tidak valid');
      }

      // Pastikan produk ada dan aktif
      const produkResult = await client.query(`
        SELECT id_produk
        FROM produk
        WHERE id_produk = $1
          AND is_active = TRUE
        FOR UPDATE;
      `, [id_produk]);

      if (produkResult.rows.length === 0) {
        throw new Error(
          `Produk dengan ID ${id_produk} tidak ditemukan atau tidak aktif`
        );
      }

      // Insert detail transaksi
      await client.query(`
        INSERT INTO detail_transaksi
        (
          id_transaksi,
          id_produk,
          jumlah,
          harga_satuan
        )
        VALUES ($1, $2, $3, $4);
      `, [
        transaksi.id_transaksi,
        id_produk,
        jumlah,
        harga_satuan || null
      ]);

      // Update stok
      await client.query(`
        UPDATE produk
        SET stok_saat_ini = stok_saat_ini + $1
        WHERE id_produk = $2;
      `, [
        jumlah,
        id_produk
      ]);
    }

    // =========================
    // 3. COMMIT
    // =========================

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Barang masuk berhasil dicatat',
      data: transaksi
    });

  } catch (error) {

    // Kalau ada error, batalkan SEMUA perubahan
    await client.query('ROLLBACK');

    console.error('BARANG MASUK ERROR:', error);

    res.status(500).json({
      message: error.message || 'Gagal mencatat barang masuk'
    });

  } finally {
    client.release();
  }
};

export const createBarangKeluar = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      no_dokumen,
      tanggal,
      keterangan,
      id_pengguna,
      items
    } = req.body;

    // =========================
    // VALIDASI REQUEST
    // =========================

    if (
      !no_dokumen ||
      !id_pengguna ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: 'Data transaksi belum lengkap'
      });
    }

    await client.query('BEGIN');

    // =========================
    // 1. INSERT TRANSAKSI
    // =========================

    const transaksiResult = await client.query(`
      INSERT INTO transaksi_stok
      (
        no_dokumen,
        tipe_transaksi,
        tanggal,
        keterangan,
        id_pengguna
      )
      VALUES ($1, 'keluar', COALESCE($2, CURRENT_TIMESTAMP), $3, $4)
      RETURNING *;
    `, [
      no_dokumen,
      tanggal || null,
      keterangan || null,
      id_pengguna
    ]);

    const transaksi = transaksiResult.rows[0];

    // =========================
    // 2. DETAIL + KURANGI STOK
    // =========================

    for (const item of items) {
      const {
        id_produk,
        jumlah,
        harga_satuan
      } = item;

      if (!id_produk || !jumlah || jumlah <= 0) {
        throw new Error('Data produk dalam transaksi tidak valid');
      }

      // Ambil dan kunci produk
      const produkResult = await client.query(`
        SELECT
          id_produk,
          stok_saat_ini
        FROM produk
        WHERE id_produk = $1
          AND is_active = TRUE
        FOR UPDATE;
      `, [id_produk]);

      if (produkResult.rows.length === 0) {
        throw new Error(
          `Produk dengan ID ${id_produk} tidak ditemukan atau tidak aktif`
        );
      }

      const produk = produkResult.rows[0];

      // =========================
      // CEK STOK
      // =========================

      if (produk.stok_saat_ini < jumlah) {
        throw new Error(
          `Stok produk ID ${id_produk} tidak mencukupi. ` +
          `Stok tersedia: ${produk.stok_saat_ini}, ` +
          `jumlah keluar: ${jumlah}`
        );
      }

      // =========================
      // INSERT DETAIL
      // =========================

      await client.query(`
        INSERT INTO detail_transaksi
        (
          id_transaksi,
          id_produk,
          jumlah,
          harga_satuan
        )
        VALUES ($1, $2, $3, $4);
      `, [
        transaksi.id_transaksi,
        id_produk,
        jumlah,
        harga_satuan || null
      ]);

      // =========================
      // KURANGI STOK
      // =========================

      await client.query(`
        UPDATE produk
        SET stok_saat_ini = stok_saat_ini - $1
        WHERE id_produk = $2;
      `, [
        jumlah,
        id_produk
      ]);
    }

    // =========================
    // 3. COMMIT
    // =========================

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Barang keluar berhasil dicatat',
      data: transaksi
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error('BARANG KELUAR ERROR:', error);

    res.status(400).json({
      message: error.message || 'Gagal mencatat barang keluar'
    });

  } finally {
    client.release();
  }
};

export const getRiwayatTransaksi = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id_transaksi,
        t.no_dokumen,
        t.tipe_transaksi,
        t.tanggal,
        t.keterangan,

        u.id_pengguna,
        u.nama AS nama_pengguna,

        s.id_supplier,
        s.nama_supplier,

        d.id_detail,
        d.id_produk,
        p.sku,
        p.nama_produk,
        p.satuan,
        d.jumlah,
        d.harga_satuan

      FROM transaksi_stok t

      JOIN pengguna u
        ON t.id_pengguna = u.id_pengguna

      LEFT JOIN supplier s
        ON t.id_supplier = s.id_supplier

      JOIN detail_transaksi d
        ON t.id_transaksi = d.id_transaksi

      JOIN produk p
        ON d.id_produk = p.id_produk

      ORDER BY t.tanggal DESC, t.id_transaksi DESC;
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('GET RIWAYAT TRANSAKSI ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil riwayat transaksi'
    });
  }
};