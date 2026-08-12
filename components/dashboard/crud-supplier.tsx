'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  kontak: string;
  alamat: string;
}

interface CrudSupplierProps {
  suppliers: Supplier[];
  onRefresh: () => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function CrudSupplier({ suppliers, onRefresh, setError, setSuccess }: CrudSupplierProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<Supplier> | null>(null);

  const handleOpenCreate = () => {
    setActiveItem({ nama_supplier: '', kontak: '', alamat: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setActiveItem(sup);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!activeItem?.nama_supplier) return;

    try {
      if (activeItem.id_supplier) {
        await api.put(`/supplier/${activeItem.id_supplier}`, activeItem);
        setSuccess('Supplier berhasil diperbarui');
      } else {
        await api.post('/supplier', activeItem);
        setSuccess('Supplier baru berhasil ditambahkan');
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan supplier');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan supplier ini? (Soft Delete)')) return;
    try {
      await api.delete(`/supplier/${id}`);
      setSuccess('Supplier berhasil dinonaktifkan');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus supplier');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kelola Supplier</h2>
          <p className="text-sm text-muted-foreground">Catat asal suplai barang inventaris dan kontak mereka.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah Supplier
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-2xl bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Nama Supplier</th>
              <th className="px-6 py-4">Kontak / Telepon</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Belum ada supplier terdaftar.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id_supplier} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{s.nama_supplier}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.kontak || '-'}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-sm truncate">{s.alamat || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id_supplier)}
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
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {activeItem.id_supplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nama Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT. Sumber Makmur"
                  value={activeItem.nama_supplier || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, nama_supplier: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Kontak / Telepon</label>
                <input
                  type="text"
                  placeholder="Contoh: 021-1234567 atau 0812xxxx"
                  value={activeItem.kontak || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, kontak: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Alamat</label>
                <textarea
                  placeholder="Masukkan alamat lengkap supplier..."
                  value={activeItem.alamat || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, alamat: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground h-20 resize-none"
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
                  Simpan Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
