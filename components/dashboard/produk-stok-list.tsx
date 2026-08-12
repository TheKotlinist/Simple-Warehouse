'use client';

import React from 'react';
import { Search, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

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

interface ProdukStokListProps {
  products: Product[];
  searchQuery: string;
}

export default function ProdukStokList({ products, searchQuery }: ProdukStokListProps) {
  const filteredProducts = products.filter(
    (p) =>
      p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kode_rak.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto flex-1 animate-in fade-in duration-150">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/10 border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
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
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                {searchQuery ? 'Tidak ditemukan produk yang cocok dengan pencarian Anda.' : 'Belum ada produk aktif yang terdaftar.'}
              </td>
            </tr>
          ) : (
            filteredProducts.map((p) => {
              const isLowStock = p.stok_saat_ini <= p.stok_minimum;
              return (
                <tr key={p.id_produk} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{p.sku}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{p.nama_produk}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.nama_kategori}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border w-fit">
                      <MapPin className="size-3 text-muted-foreground" />
                      {p.kode_rak}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-muted-foreground">
                    {p.stok_minimum} <span className="text-xs text-muted-foreground/60">{p.satuan}</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                    {p.stok_saat_ini} <span className="text-xs font-normal text-muted-foreground/75">{p.satuan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <AlertCircle className="size-3.5" />
                          Stok Menipis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                          <CheckCircle2 className="size-3.5" />
                          Aman
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
