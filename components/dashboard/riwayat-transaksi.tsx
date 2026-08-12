'use client';

import React from 'react';
import { ArrowDownLeft, ArrowUpRight, User } from 'lucide-react';

interface TransactionDetail {
  id_transaksi: number;
  no_dokumen: string;
  tipe_transaksi: 'masuk' | 'keluar';
  tanggal: string;
  keterangan: string;
  nama_pengguna: string;
  nama_supplier: string | null;
  sku: string;
  nama_produk: string;
  satuan: string;
  jumlah: number;
  harga_satuan: string | null;
}

interface RiwayatTransaksiProps {
  transactions: TransactionDetail[];
}

export default function RiwayatTransaksi({ transactions }: RiwayatTransaksiProps) {
  return (
    <div className="overflow-x-auto flex-1 animate-in fade-in duration-150">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/10 border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <th className="px-6 py-4">Tanggal</th>
            <th className="px-6 py-4">No Dokumen</th>
            <th className="px-6 py-4">Tipe</th>
            <th className="px-6 py-4">Produk</th>
            <th className="px-6 py-4 text-right">Jumlah</th>
            <th className="px-6 py-4">Supplier / Kontak</th>
            <th className="px-6 py-4">Keterangan</th>
            <th className="px-6 py-4">Petugas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-sm">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                Belum ada transaksi stok tercatat.
              </td>
            </tr>
          ) : (
            transactions.map((t, idx) => {
              const isMasuk = t.tipe_transaksi === 'masuk';
              return (
                <tr key={`${t.id_transaksi}-${t.sku}-${idx}`} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(t.tanggal).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{t.no_dokumen}</td>
                  <td className="px-6 py-4">
                    {isMasuk ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                        <ArrowDownLeft className="size-3.5" />
                        Masuk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                        <ArrowUpRight className="size-3.5" />
                        Keluar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{t.nama_produk}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{t.sku}</div>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${isMasuk ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isMasuk ? `+${t.jumlah}` : `-${t.jumlah}`} <span className="text-xs font-normal text-muted-foreground/60">{t.satuan}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {t.nama_supplier || '-'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={t.keterangan || ''}>
                    {t.keterangan || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    <span className="flex items-center gap-1 text-xs">
                      <User className="size-3.5 text-muted-foreground/60" />
                      {t.nama_pengguna}
                    </span>
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
