import express from 'express';
import cors from 'cors';

import produkRoutes from './routes/produkRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Backend Warehouse Management berjalan!'
  });
});

app.use('/api/produk', produkRoutes);

export default app;