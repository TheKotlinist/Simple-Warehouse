'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  id_produk: number;
  sku: string;
  nama_produk: string;
  satuan: string;
  stok_saat_ini: number;
}

interface Supplier {
  id_supplier: number;
  nama_supplier: string;
}

interface ModalBarangMasukProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
  suppliers: Supplier[];
  userId?: number;
}

export default function ModalBarangMasuk({ isOpen, onClose, onSuccess, products, suppliers, userId }: ModalBarangMasukProps) {
  const [noDokumen, setNoDokumen] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [txItems, setTxItems] = useState<{ id_produk: string; jumlah: number; harga_satuan: number }[]>([
    { id_produk: '', jumlah: 1, harga_satuan: 0 }
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setNoDokumen(`DOC-${Date.now().toString().slice(-6)}`);
        setTanggal(new Date().toISOString().substring(0, 10));
        setKeterangan('');
        setSelectedSupplierId('');
        setTxItems([{ id_produk: '', jumlah: 1, harga_satuan: 0 }]);
        setFormError(null);
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTxItem = () => {
    setTxItems([...txItems, { id_produk: '', jumlah: 1, harga_satuan: 0 }]);
  };

  const handleRemoveTxItem = (index: number) => {
    if (txItems.length === 1) return;
    const newItems = [...txItems];
    newItems.splice(index, 1);
    setTxItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...txItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTxItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!noDokumen || !selectedSupplierId) {
      setFormError('Nomor dokumen dan Supplier wajib diisi');
      return;
    }

    const invalidItem = txItems.some(item => !item.id_produk || item.jumlah <= 0);
    if (invalidItem) {
      setFormError('Harap pilih produk dan masukkan jumlah yang valid (minimal 1)');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/transaksi/masuk', {
        no_dokumen: noDokumen,
        tanggal: tanggal,
        keterangan: keterangan,
        id_supplier: parseInt(selectedSupplierId),
        id_pengguna: userId,
        items: txItems.map(item => ({
          id_produk: parseInt(item.id_produk),
          customField: 1, // dummy to prevent empty payload issues if any
          jumlah: item.jumlah,
          harga_satuan: item.harga_satuan || null
        }))
      });
      onSuccess();
      onClose();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan transaksi barang masuk';
      setFormError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl">
              <ArrowDownLeft className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Catat Barang Masuk</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          {formError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. Dokumen</label>
              <input
                type="text"
                required
                value={noDokumen}
                onChange={(e) => setNoDokumen(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplier</label>
              <select
                required
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map(s => (
                  <option key={s.id_supplier} value={s.id_supplier}>
                    {s.nama_supplier}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Keterangan / Memo</label>
              <input
                type="text"
                placeholder="Contoh: Purchase Order #01"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-sm font-bold text-foreground">Daftar Produk Masuk</span>
              <button
                type="button"
                onClick={handleAddTxItem}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                Tambah Baris
              </button>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {txItems.map((item, index) => (
                <div key={index} className="flex items-end gap-3 border border-border/40 p-3 rounded-2xl bg-muted/20">
                  <div className="flex-1 space-y-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produk</label>
                    <select
                      required
                      value={item.id_produk}
                      onChange={(e) => handleItemChange(index, 'id_produk', e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary text-foreground"
                    >
                      <option value="">-- Pilih Produk --</option>
                      {products.map(p => (
                        <option key={p.id_produk} value={p.id_produk}>
                          {p.nama_produk} ({p.sku}) - Stok: {p.stok_saat_ini}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24 space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Jumlah</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={item.jumlah}
                      onChange={(e) => handleItemChange(index, 'jumlah', parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="w-28 space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Harga (Opsional)</label>
                    <input
                      type="number"
                      min={0}
                      value={item.harga_satuan}
                      onChange={(e) => handleItemChange(index, 'harga_satuan', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTxItem(index)}
                    disabled={txItems.length === 1}
                    className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent mb-0.5 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted text-muted-foreground cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
