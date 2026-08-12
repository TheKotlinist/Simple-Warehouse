import pool from '../config/database.js';

export const getAllSupplier = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_supplier,
        nama_supplier,
        kontak,
        alamat
      FROM supplier
      WHERE is_active = TRUE
      ORDER BY id_supplier;
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('GET SUPPLIER ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil data supplier'
    });
  }
};


export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        id_supplier,
        nama_supplier,
        kontak,
        alamat
      FROM supplier
      WHERE id_supplier = $1
        AND is_active = TRUE;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Supplier tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('GET SUPPLIER BY ID ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil supplier'
    });
  }
};


export const createSupplier = async (req, res) => {
  try {
    const {
      nama_supplier,
      kontak,
      alamat
    } = req.body;

    if (!nama_supplier) {
      return res.status(400).json({
        message: 'Nama supplier wajib diisi'
      });
    }

    const result = await pool.query(`
      INSERT INTO supplier
      (
        nama_supplier,
        kontak,
        alamat
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [
      nama_supplier,
      kontak || null,
      alamat || null
    ]);

    res.status(201).json({
      message: 'Supplier berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('CREATE SUPPLIER ERROR:', error);

    res.status(500).json({
      message: 'Gagal menambahkan supplier'
    });
  }
};


export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nama_supplier,
      kontak,
      alamat
    } = req.body;

    if (!nama_supplier) {
      return res.status(400).json({
        message: 'Nama supplier wajib diisi'
      });
    }

    const result = await pool.query(`
      UPDATE supplier
      SET
        nama_supplier = $1,
        kontak = $2,
        alamat = $3
      WHERE id_supplier = $4
      RETURNING *;
    `, [
      nama_supplier,
      kontak || null,
      alamat || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Supplier tidak ditemukan'
      });
    }

    res.json({
      message: 'Supplier berhasil diperbarui',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('UPDATE SUPPLIER ERROR:', error);

    res.status(500).json({
      message: 'Gagal memperbarui supplier'
    });
  }
};


export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE supplier
      SET is_active = FALSE
      WHERE id_supplier = $1
        AND is_active = TRUE
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Supplier tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json({
      message: 'Supplier berhasil dinonaktifkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('DELETE SUPPLIER ERROR:', error);

    res.status(500).json({
      message: 'Gagal menonaktifkan supplier'
    });
  }
};