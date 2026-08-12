import pool from '../config/database.js';

export const getLaporanStokMinimum = async (req, res) => {
  try {
    const result = await pool.query(`
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
        AND p.stok_saat_ini <= p.stok_minimum
      ORDER BY p.stok_saat_ini ASC;
    `);

    res.json({
      total: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('LAPORAN STOK MINIMUM ERROR:', error);

    res.status(500).json({
      message: 'Gagal mengambil laporan stok minimum'
    });
  }
};