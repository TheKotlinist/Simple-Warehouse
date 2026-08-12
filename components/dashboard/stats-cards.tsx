'use client';

import React from 'react';
import { Package, RefreshCw, AlertCircle } from 'lucide-react';

interface Product {
  id_produk: number;
  sku: string;
  nama_produk: string;
  satuan: string;
  stok_saat_ini: number;
  stok_minimum: number;
  nama_kategori: string;
  kode_rak: string;
}

interface StatsCardsProps {
  products: Product[];
}

export default function StatsCards({ products }: StatsCardsProps) {
  const totalStok = products.reduce((acc, curr) => acc + curr.stok_saat_ini, 0);
  const lowStockCount = products.filter(p => p.stok_saat_ini <= p.stok_minimum).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 mt-8">
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Total Jenis Produk</span>
          <div className="size-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Package className="size-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground font-mono">{products.length}</p>
        <p className="text-xs text-muted-foreground mt-2">Aktif di database</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Total Fisik Stok</span>
          <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <RefreshCw className="size-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground font-mono">{totalStok}</p>
        <p className="text-xs text-muted-foreground mt-2">Unit barang terdata</p>
      </div>

      <div className={`bg-card border p-6 rounded-3xl shadow-sm transition-all ${lowStockCount > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-border'}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Stok Menipis (Peringatan)</span>
          <div className={`size-8 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-green-500/10 text-green-500'}`}>
            <AlertCircle className="size-4" />
          </div>
        </div>
        <p className={`text-3xl font-bold font-mono ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
          {lowStockCount}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Di bawah atau sama dengan batas minimum</p>
      </div>
    </div>
  );
}
