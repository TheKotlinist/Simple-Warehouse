'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface UserProfile {
  id_pengguna: number;
  nama: string;
  email: string;
  role: 'supervisor' | 'staff_gudang';
  is_active: boolean;
}

interface CrudPenggunaProps {
  users: UserProfile[];
  onRefresh: () => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function CrudPengguna({ users, onRefresh, setError, setSuccess }: CrudPenggunaProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<UserProfile> & { password?: string } | null>(null);

  const handleOpenCreate = () => {
    setActiveItem({ nama: '', email: '', password: '', role: 'staff_gudang', is_active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (usr: UserProfile) => {
    setActiveItem({ ...usr, password: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!activeItem?.nama || !activeItem?.email || !activeItem?.role) return;

    try {
      if (activeItem.id_pengguna) {
        const payload: any = {
          nama: activeItem.nama,
          email: activeItem.email,
          role: activeItem.role,
          is_active: activeItem.is_active
        };
        if (activeItem.password) payload.password = activeItem.password;
        await api.put(`/pengguna/${activeItem.id_pengguna}`, payload);
        setSuccess('Pengguna berhasil diperbarui');
      } else {
        if (!activeItem.password) {
          setError('Password wajib diisi untuk pengguna baru');
          return;
        }
        await api.post('/pengguna', activeItem);
        setSuccess('Pengguna baru berhasil ditambahkan');
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengguna');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan pengguna ini? (Mereka tidak akan bisa login lagi)')) return;
    try {
      await api.delete(`/pengguna/${id}`);
      setSuccess('Pengguna berhasil dinonaktifkan (Soft Delete)');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menonaktifkan pengguna');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kelola Pengguna</h2>
          <p className="text-sm text-muted-foreground">Daftarkan staff gudang baru, perbarui data mereka, atau aktifkan/nonaktifkan akun.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah Pengguna
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-2xl bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Nama Pengguna</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Peran (Role)</th>
              <th className="px-6 py-4 text-center">Status Keaktifan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id_pengguna} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{u.nama}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono">{u.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${u.role === 'supervisor' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400'}`}>
                      {u.role === 'supervisor' ? 'Supervisor' : 'Staff Gudang'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'}`}>
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      {u.is_active && (
                        <button
                          onClick={() => handleDelete(u.id_pengguna)}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {activeItem.id_pengguna ? 'Edit Akun Pengguna' : 'Daftarkan Pengguna Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap staff"
                  value={activeItem.nama || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, nama: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email (Digunakan Login)</label>
                <input
                  type="email"
                  required
                  placeholder="staff@perusahaan.com"
                  value={activeItem.email || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Password {activeItem.id_pengguna && '(Kosongkan jika tidak ingin mengubah)'}
                </label>
                <input
                  type="password"
                  required={!activeItem.id_pengguna}
                  placeholder={activeItem.id_pengguna ? 'Tulis password baru jika diubah' : '••••••••'}
                  value={activeItem.password || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, password: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Peran / Hak Akses</label>
                  <select
                    required
                    value={activeItem.role || ''}
                    onChange={(e) => setActiveItem({ ...activeItem, role: e.target.value as any })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="staff_gudang">Staff Gudang</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Status Akun</label>
                  <select
                    required
                    value={activeItem.is_active ? 'true' : 'false'}
                    onChange={(e) => setActiveItem({ ...activeItem, is_active: e.target.value === 'true' })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
