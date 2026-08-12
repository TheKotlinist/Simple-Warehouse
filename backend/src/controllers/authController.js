import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi'
      });
    }

    const result = await pool.query(`
      SELECT
        id_pengguna,
        nama,
        email,
        password,
        role,
        is_active
      FROM pengguna
      WHERE email = $1;
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Email atau password salah'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        message: 'Akun sudah tidak aktif'
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Email atau password salah'
      });
    }

    // =========================
    // BUAT JWT
    // =========================

    const token = jwt.sign(
      {
        id_pengguna: user.id_pengguna,
        nama: user.nama,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );


    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id_pengguna: user.id_pengguna,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      message: 'Gagal melakukan login'
    });
  }
};