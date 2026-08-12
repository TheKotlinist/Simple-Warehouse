'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

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

interface LaporanStokMinimumProps {
  lowStockProducts: Product[];
  reportTotal: number;
}

export default function LaporanStokMinimum({ lowStockProducts, reportTotal }: LaporanStokMinimumProps) {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Laporan Stok Minimum</h2>
          <p className="text-sm text-muted-foreground">Daftar produk yang jumlah stok fisiknya berada di bawah atau sama dengan batas aman.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-semibold">
          Total Item Kritis: {reportTotal}
        </div>
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
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {lowStockProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Sangat bagus! Semua stok produk dalam kondisi aman di atas batas minimum.
                </td>
              </tr>
            ) : (
              lowStockProducts.map((p) => (
                <tr key={p.id_produk} className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{p.sku}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{p.nama_produk}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.nama_kategori}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                      {p.kode_rak}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-muted-foreground">{p.stok_minimum} {p.satuan}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">{p.stok_saat_ini} {p.satuan}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">
                      Peringatan Stok Low
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
