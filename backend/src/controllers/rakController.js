import pool from '../config/database.js';

export const getAllRak = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_lokasi,
        kode_rak,
        zona,
        kapasitas
      FROM lokasi_rak
      WHERE is_active = TRUE
      ORDER BY id_lokasi;
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('GET RAK ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil data rak'
    });
  }
};

export const getRakById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        id_lokasi,
        kode_rak,
        zona,
        kapasitas
      FROM lokasi_rak
      WHERE id_lokasi = $1
        AND is_active = TRUE;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Rak tidak ditemukan'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('GET RAK BY ID ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil data rak'
    });
  }
};


export const createRak = async (req, res) => {
  try {
    const {
      kode_rak,
      zona,
      kapasitas
    } = req.body;

    if (
      !kode_rak ||
      !zona ||
      kapasitas === undefined
    ) {
      return res.status(400).json({
        message: 'Kode rak, zona, dan kapasitas wajib diisi'
      });
    }

    const result = await pool.query(`
      INSERT INTO lokasi_rak
      (
        kode_rak,
        zona,
        kapasitas
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [
      kode_rak,
      zona,
      kapasitas
    ]);

    res.status(201).json({
      message: 'Rak berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('CREATE RAK ERROR:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Kode rak sudah digunakan'
      });
    }

    res.status(500).json({
      message: 'Gagal menambahkan rak'
    });
  }
};


export const updateRak = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      kode_rak,
      zona,
      kapasitas
    } = req.body;

    if (
      !kode_rak ||
      !zona ||
      kapasitas === undefined
    ) {
      return res.status(400).json({
        message: 'Kode rak, zona, dan kapasitas wajib diisi'
      });
    }

    const result = await pool.query(`
      UPDATE lokasi_rak
      SET
        kode_rak = $1,
        zona = $2,
        kapasitas = $3
      WHERE id_lokasi = $4
      RETURNING *;
    `, [
      kode_rak,
      zona,
      kapasitas,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Rak tidak ditemukan'
      });
    }

    res.json({
      message: 'Rak berhasil diperbarui',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('UPDATE RAK ERROR:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Kode rak sudah digunakan'
      });
    }

    res.status(500).json({
      message: 'Gagal memperbarui rak'
    });
  }
};


export const deleteRak = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE lokasi_rak
      SET is_active = FALSE
      WHERE id_lokasi = $1
        AND is_active = TRUE
      RETURNING
        id_lokasi,
        kode_rak,
        zona,
        kapasitas,
        is_active;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Rak tidak ditemukan atau sudah dinonaktifkan'
      });
    }

    res.json({
      message: 'Rak berhasil dinonaktifkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('DELETE RAK ERROR:', error);

    res.status(500).json({
      message: 'Gagal menonaktifkan rak'
    });
  }
};