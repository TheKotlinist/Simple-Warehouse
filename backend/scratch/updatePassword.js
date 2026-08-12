import bcrypt from 'bcryptjs';
import pool from '../src/config/database.js';

async function update() {
  try {
    const hash = await bcrypt.hash('123456', 10);
    await pool.query('UPDATE pengguna SET password = $1 WHERE email = $2', [hash, 'andi@warehouse.com']);
    console.log('Andi password updated successfully with bcrypt hash');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    pool.end();
  }
}

update();
