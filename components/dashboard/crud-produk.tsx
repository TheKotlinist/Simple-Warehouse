'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  id_produk: number;
  sku: string;
  nama_produk: string;
  satuan: string;
  stok_saat_ini: number;
  stok_minimum: number;
  id_kategori?: number;
  nama_kategori: string;
  id_lokasi?: number;
  kode_rak: string;
}

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

interface Rack {
  id_lokasi: number;
  kode_rak: string;
  zona: string;
}

interface CrudProdukProps {
  products: Product[];
  categories: Category[];
  racks: Rack[];
  onRefresh: () => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function CrudProduk({ products, categories, racks, onRefresh, setError, setSuccess }: CrudProdukProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<Product> | null>(null);

  const handleOpenCreate = () => {
    setActiveItem({ sku: '', nama_produk: '', satuan: 'Pcs', stok_minimum: 5, id_kategori: undefined, id_lokasi: undefined });
    setShowModal(true);
  };

  const handleOpenEdit = async (id: number) => {
    try {
      const prodDetail = await api.get(`/produk/${id}`);
      setActiveItem(prodDetail);
      setShowModal(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal mengambil detail produk';
      setError(errMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!activeItem?.sku || !activeItem?.nama_produk || !activeItem?.id_kategori || !activeItem?.id_lokasi) {
      setError('Harap lengkapi semua field produk');
      return;
    }

    try {
      if (activeItem.id_produk) {
        await api.put(`/produk/${activeItem.id_produk}`, activeItem);
        setSuccess('Produk berhasil diperbarui');
      } else {
        await api.post('/produk', activeItem);
        setSuccess('Produk baru berhasil ditambahkan');
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan produk';
      setError(errMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan produk ini? (Soft Delete)')) return;
    try {
      await api.delete(`/produk/${id}`);
      setSuccess('Produk berhasil dinonaktifkan (Soft Delete)');
      onRefresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menghapus produk';
      setError(errMsg);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kelola Master Produk</h2>
          <p className="text-sm text-muted-foreground">Tambahkan produk baru, perbarui informasi, atau nonaktifkan produk.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah Produk
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-2xl bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Lokasi Rak</th>
              <th className="px-6 py-4 text-right">Stok Minimum</th>
              <th className="px-6 py-4 text-right">Stok Saat Ini</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Belum ada produk terdaftar.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id_produk} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{p.sku}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{p.nama_produk}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.nama_kategori}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                      {p.kode_rak}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground font-mono">{p.stok_minimum} {p.satuan}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-foreground">{p.stok_saat_ini} {p.satuan}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p.id_produk)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id_produk)}
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
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {activeItem.id_produk ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">SKU / Kode Unik</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PROD-001"
                  value={activeItem.sku || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, sku: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama produk"
                  value={activeItem.nama_produk || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, nama_produk: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Satuan</label>
                  <input
                    type="text"
                    required
                    placeholder="Pcs, Dus, Kg, Liter..."
                    value={activeItem.satuan || ''}
                    onChange={(e) => setActiveItem({ ...activeItem, satuan: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Stok Minimum</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={activeItem.stok_minimum ?? 5}
                    onChange={(e) => setActiveItem({ ...activeItem, stok_minimum: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Kategori</label>
                  <select
                    required
                    value={activeItem.id_kategori || ''}
                    onChange={(e) => setActiveItem({ ...activeItem, id_kategori: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                      <option key={c.id_kategori} value={c.id_kategori}>{c.nama_kategori}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Lokasi Rak</label>
                  <select
                    required
                    value={activeItem.id_lokasi || ''}
                    onChange={(e) => setActiveItem({ ...activeItem, id_lokasi: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="">-- Pilih Rak --</option>
                    {racks.map(r => (
                      <option key={r.id_lokasi} value={r.id_lokasi}>{r.kode_rak} ({r.zona})</option>
                    ))}
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
