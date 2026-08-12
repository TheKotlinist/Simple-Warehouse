import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getAllPengguna = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_pengguna,
        nama,
        email,
        role,
        is_active
      FROM pengguna
      ORDER BY id_pengguna;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('GET ALL PENGGUNA ERROR:', error);
    res.status(500).json({
      message: 'Gagal mengambil data pengguna'
    });
  }
};

export const getPenggunaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT
        id_pengguna,
        nama,
        email,
        role,
        is_active
      FROM pengguna
      WHERE id_pengguna = $1;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan'
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('GET PENGGUNA BY ID ERROR:', error);
    res.status(500).json({
      message: 'Gagal mengambil data pengguna'
    });
  }
};

export const createPengguna = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password || !role) {
      return res.status(400).json({
        message: 'Semua field (nama, email, password, role) wajib diisi'
      });
    }

    if (role !== 'supervisor' && role !== 'staff_gudang') {
      return res.status(400).json({
        message: 'Role tidak valid. Harus supervisor atau staff_gudang'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO pengguna (nama, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id_pengguna, nama, email, role, is_active;
    `, [nama, email, hashedPassword, role]);

    res.status(201).json({
      message: 'Pengguna berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('CREATE PENGGUNA ERROR:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Email sudah digunakan'
      });
    }

    res.status(500).json({
      message: 'Gagal menambahkan pengguna'
    });
  }
};

export const updatePengguna = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, role, is_active, password } = req.body;

    if (!nama || !email || !role || is_active === undefined) {
      return res.status(400).json({
        message: 'Field (nama, email, role, is_active) wajib diisi'
      });
    }

    if (role !== 'supervisor' && role !== 'staff_gudang') {
      return res.status(400).json({
        message: 'Role tidak valid. Harus supervisor atau staff_gudang'
      });
    }

    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(`
        UPDATE pengguna
        SET nama = $1, email = $2, role = $3, is_active = $4, password = $5
        WHERE id_pengguna = $6
        RETURNING id_pengguna, nama, email, role, is_active;
      `, [nama, email, role, is_active, hashedPassword, id]);
    } else {
      result = await pool.query(`
        UPDATE pengguna
        SET nama = $1, email = $2, role = $3, is_active = $4
        WHERE id_pengguna = $5
        RETURNING id_pengguna, nama, email, role, is_active;
      `, [nama, email, role, is_active, id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.json({
      message: 'Pengguna berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('UPDATE PENGGUNA ERROR:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Email sudah digunakan'
      });
    }

    res.status(500).json({
      message: 'Gagal memperbarui pengguna'
    });
  }
};

export const deletePengguna = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE pengguna
      SET is_active = FALSE
      WHERE id_pengguna = $1
        AND is_active = TRUE
      RETURNING id_pengguna, nama, email, role, is_active;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json({
      message: 'Pengguna berhasil dinonaktifkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('DELETE PENGGUNA ERROR:', error);
    res.status(500).json({
      message: 'Gagal menonaktifkan pengguna'
    });
  }
};
