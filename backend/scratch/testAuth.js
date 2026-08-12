import app from '../src/app.js';
import pool from '../src/config/database.js';

const PORT = 5001;
const baseUrl = `http://localhost:${PORT}`;

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    try {
      // 1. LOGIN BUDI (STAFF GUDANG)
      console.log('\n--- 1. Login sebagai Staff Gudang (Budi) ---');
      const budiLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'budi@warehouse.com', password: '123456' })
      });
      const budiLogin = await budiLoginRes.json();
      console.log('Status Login:', budiLoginRes.status);
      console.log('Message:', budiLogin.message);
      const budiToken = budiLogin.token;

      // 2. LOGIN ANDI (SUPERVISOR)
      console.log('\n--- 2. Login sebagai Supervisor (Andi) ---');
      const andiLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'andi@warehouse.com', password: '123456' })
      });
      const andiLogin = await andiLoginRes.json();
      console.log('Status Login:', andiLoginRes.status);
      console.log('Message:', andiLogin.message);
      const andiToken = andiLogin.token;

      // 3. PENGUJIAN OTORISASI STAFF
      console.log('\n--- 3. Pengujian Akses Staff (Budi) ---');
      // GET /api/produk (Boleh)
      const budiGetProduk = await fetch(`${baseUrl}/api/produk`, {
        headers: { 'Authorization': `Bearer ${budiToken}` }
      });
      console.log('GET /api/produk (Harus 200):', budiGetProduk.status);

      // GET /api/kategori (Harus 403)
      const budiGetKategori = await fetch(`${baseUrl}/api/kategori`, {
        headers: { 'Authorization': `Bearer ${budiToken}` }
      });
      console.log('GET /api/kategori (Harus 403):', budiGetKategori.status);
      console.log('Response Kategori:', await budiGetKategori.json());

      // GET /api/pengguna (Harus 403)
      const budiGetPengguna = await fetch(`${baseUrl}/api/pengguna`, {
        headers: { 'Authorization': `Bearer ${budiToken}` }
      });
      console.log('GET /api/pengguna (Harus 403):', budiGetPengguna.status);
      console.log('Response Pengguna:', await budiGetPengguna.json());

      // 4. PENGUJIAN OTORISASI SUPERVISOR
      console.log('\n--- 4. Pengujian Akses Supervisor (Andi) ---');
      // GET /api/kategori (Boleh)
      const andiGetKategori = await fetch(`${baseUrl}/api/kategori`, {
        headers: { 'Authorization': `Bearer ${andiToken}` }
      });
      console.log('GET /api/kategori (Harus 200):', andiGetKategori.status);

      // GET /api/pengguna (Boleh)
      const andiGetPengguna = await fetch(`${baseUrl}/api/pengguna`, {
        headers: { 'Authorization': `Bearer ${andiToken}` }
      });
      console.log('GET /api/pengguna (Harus 200):', andiGetPengguna.status);

      // 5. PENGUJIAN KELOLA PENGGUNA (TAMBAH, UBAH, NONAKTIFKAN)
      console.log('\n--- 5. Pengujian Kelola Pengguna (Supervisor) ---');
      // Tambah pengguna baru
      const createPenggunaRes = await fetch(`${baseUrl}/api/pengguna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${andiToken}`
        },
        body: JSON.stringify({
          nama: 'Test User',
          email: 'test_user@warehouse.com',
          password: 'password123',
          role: 'staff_gudang'
        })
      });
      const createdUser = await createPenggunaRes.json();
      console.log('POST /api/pengguna (Harus 201):', createPenggunaRes.status);
      console.log('Data User Baru:', createdUser.data);
      const testUserId = createdUser.data.id_pengguna;

      // Ubah pengguna (Ubah role ke supervisor)
      const updatePenggunaRes = await fetch(`${baseUrl}/api/pengguna/${testUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${andiToken}`
        },
        body: JSON.stringify({
          nama: 'Test User Updated',
          email: 'test_user@warehouse.com',
          role: 'supervisor',
          is_active: true
        })
      });
      console.log('PUT /api/pengguna/:id (Harus 200):', updatePenggunaRes.status);
      console.log('Data User Diupdate:', (await updatePenggunaRes.json()).data);

      // Nonaktifkan pengguna (DELETE)
      const deletePenggunaRes = await fetch(`${baseUrl}/api/pengguna/${testUserId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${andiToken}` }
      });
      console.log('DELETE /api/pengguna/:id (Harus 200):', deletePenggunaRes.status);
      console.log('Data User Dinonaktifkan:', (await deletePenggunaRes.json()).data);

      // 6. UJI LOGIN AKUN NONAKTIF
      console.log('\n--- 6. Pengujian Login Akun Nonaktif ---');
      const inactiveLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test_user@warehouse.com', password: 'password123' })
      });
      console.log('Login Akun Nonaktif (Harus 403):', inactiveLoginRes.status);
      console.log('Response Login:', await inactiveLoginRes.json());

      // CLEANUP: Hapus test_user dari database agar bisa dijalankan ulang bersih
      console.log('\n--- 7. Cleanup Database ---');
      await pool.query('DELETE FROM pengguna WHERE id_pengguna = $1', [testUserId]);
      console.log('Test User dihapus dari database.');

      console.log('\n=== SEMUA PENGUJIAN SELESAI ===');

    } catch (err) {
      console.error('ERROR SELAMA TEST:', err);
    } finally {
      server.close();
      pool.end();
    }
  });
}

runTests();
