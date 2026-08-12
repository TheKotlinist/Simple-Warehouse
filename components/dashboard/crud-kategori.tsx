'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

interface CrudKategoriProps {
  categories: Category[];
  onRefresh: () => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function CrudKategori({ categories, onRefresh, setError, setSuccess }: CrudKategoriProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<Category> | null>(null);

  const handleOpenCreate = () => {
    setActiveItem({ nama_kategori: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setActiveItem(cat);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!activeItem?.nama_kategori) return;

    try {
      if (activeItem.id_kategori) {
        await api.put(`/kategori/${activeItem.id_kategori}`, activeItem);
        setSuccess('Kategori berhasil diperbarui');
      } else {
        await api.post('/kategori', activeItem);
        setSuccess('Kategori baru berhasil ditambahkan');
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan kategori';
      setError(errMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan kategori ini? (Soft Delete)')) return;
    try {
      await api.delete(`/kategori/${id}`);
      setSuccess('Kategori berhasil dinonaktifkan');
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menghapus kategori';
      setError(errMsg);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kelola Kategori</h2>
          <p className="text-sm text-muted-foreground">Grupkan produk Anda untuk kemudahan analisis dan pelaporan.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="max-w-xl overflow-x-auto border border-border rounded-2xl bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nama Kategori</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  Belum ada kategori terdaftar.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id_kategori} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted-foreground">{c.id_kategori}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{c.nama_kategori}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id_kategori)}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
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
          <div className="bg-card border border-border rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {activeItem.id_kategori ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Elektronik, Makanan, Medis"
                  value={activeItem.nama_kategori || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, nama_kategori: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
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
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
