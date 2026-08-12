import express from 'express';
import cors from 'cors';

import produkRoutes from './routes/produkRoutes.js';
import transaksiRoutes from './routes/transaksiRoutes.js';
import laporanRoutes from './routes/laporanRoutes.js';
import kategoriRoutes from './routes/kategoriRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import rakRoutes from './routes/rakRoutes.js';
import authRoutes from './routes/authRoutes.js';
import penggunaRoutes from './routes/penggunaRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Backend Warehouse Management berjalan!'
  });
});

app.use('/api/produk', produkRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/rak', rakRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pengguna', penggunaRoutes);

export default app;