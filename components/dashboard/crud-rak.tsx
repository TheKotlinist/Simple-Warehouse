'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Rack {
  id_lokasi: number;
  kode_rak: string;
  zona: string;
  kapasitas: number;
}

interface CrudRakProps {
  racks: Rack[];
  onRefresh: () => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function CrudRak({ racks, onRefresh, setError, setSuccess }: CrudRakProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<Rack> | null>(null);

  const handleOpenCreate = () => {
    setActiveItem({ kode_rak: '', zona: '', kapasitas: 100 });
    setShowModal(true);
  };

  const handleOpenEdit = (rk: Rack) => {
    setActiveItem(rk);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!activeItem?.kode_rak || !activeItem?.zona || activeItem?.kapasitas === undefined) return;

    try {
      if (activeItem.id_lokasi) {
        await api.put(`/rak/${activeItem.id_lokasi}`, activeItem);
        setSuccess('Rak berhasil diperbarui');
      } else {
        await api.post('/rak', activeItem);
        setSuccess('Rak baru berhasil ditambahkan');
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan rak';
      setError(errMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan rak ini? (Soft Delete)')) return;
    try {
      await api.delete(`/rak/${id}`);
      setSuccess('Rak berhasil dinonaktifkan');
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menghapus rak';
      setError(errMsg);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kelola Lokasi Rak</h2>
          <p className="text-sm text-muted-foreground">Atur tata letak ruang penyimpanan barang di dalam gudang.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah Rak
        </button>
      </div>

      <div className="max-w-3xl overflow-x-auto border border-border rounded-2xl bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Kode Rak</th>
              <th className="px-6 py-4">Zona / Blok</th>
              <th className="px-6 py-4 text-right">Kapasitas (Unit)</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {racks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Belum ada lokasi rak terdaftar.
                </td>
              </tr>
            ) : (
              racks.map((r) => (
                <tr key={r.id_lokasi} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-foreground">{r.kode_rak}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.zona}</td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-foreground">{r.kapasitas}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id_lokasi)}
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
                {activeItem.id_lokasi ? 'Edit Lokasi Rak' : 'Tambah Lokasi Rak'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Kode Rak (Harus Unik)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: RAK-A1, RAK-C5"
                  value={activeItem.kode_rak || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, kode_rak: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Zona / Blok Gudang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Blok A (Barat), Blok C (Pendingin)"
                  value={activeItem.zona || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, zona: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Kapasitas Maksimum (Unit)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={activeItem.kapasitas ?? 100}
                  onChange={(e) => setActiveItem({ ...activeItem, kapasitas: parseInt(e.target.value) || 0 })}
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
                  Simpan Rak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
