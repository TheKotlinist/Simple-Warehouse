'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { 
  Search, Plus, Minus, LogOut, Package, History, RefreshCw, Loader2, User, Shield
} from 'lucide-react';
import Link from 'next/link';

import StatsCards from '@/components/dashboard/stats-cards';
import ProdukStokList from '@/components/dashboard/produk-stok-list';
import RiwayatTransaksi from '@/components/dashboard/riwayat-transaksi';
import ModalBarangMasuk from '@/components/dashboard/modal-barang-masuk';
import ModalBarangKeluar from '@/components/dashboard/modal-barang-keluar';

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

interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  kontak: string;
  alamat: string;
}

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

export default function StaffDashboardPage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'produk' | 'riwayat'>('produk');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [showInModal, setShowInModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setErrorMsg(null);
    try {
      const [prodRes, trxRes, supRes] = await Promise.all([
        api.get('/produk'),
        api.get('/transaksi'),
        api.get('/supplier').catch(() => [])
      ]);
      setProducts(prodRes || []);
      setTransactions(trxRes || []);
      setSuppliers(supRes || []);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Gagal memuat data dari server.';
      setErrorMsg(errMsg);
    } finally {
      setLoadingData(false);
    }
  };

  if (loadingData && products.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground font-medium">Memuat data inventaris...</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 ${isEmbedded ? 'pt-0' : ''}`}>
      {!isEmbedded && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-border bg-card p-6 rounded-3xl mb-8 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <User className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Halo, {user?.nama}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Shield className="size-3.5 text-primary" />
                Staff Gudang
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchDashboardData}
              className="flex items-center justify-center p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="size-4" />
            </button>
            {user?.role === 'supervisor' && (
              <Link
                href="/dashboard/supervisor"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/30 hover:bg-primary/5 text-primary font-medium text-sm transition-all"
              >
                <span>Dashboard Supervisor</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium text-sm transition-all cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      <StatsCards products={products} />

      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="border-b border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
          <div className="flex items-center bg-muted/65 p-1 rounded-2xl border border-border/80 w-fit">
            <button
              onClick={() => setActiveTab('produk')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${activeTab === 'produk' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Package className="size-4" />
              <span>Daftar Stok Produk</span>
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${activeTab === 'riwayat' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <History className="size-4" />
              <span>Riwayat Transaksi</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab === 'produk' && (
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari produk SKU atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Barang Masuk</span>
              </button>
              <button
                onClick={() => setShowOutModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-border text-sm font-semibold shadow transition-all cursor-pointer"
              >
                <Minus className="size-4" />
                <span>Barang Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="m-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
            <Loader2 className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'produk' ? (
          <ProdukStokList products={products} searchQuery={searchQuery} />
        ) : (
          <RiwayatTransaksi transactions={transactions} />
        )}
      </div>

      <ModalBarangMasuk
        isOpen={showInModal}
        onClose={() => setShowInModal(false)}
        onSuccess={fetchDashboardData}
        products={products}
        suppliers={suppliers}
        userId={user?.id_pengguna}
      />

      <ModalBarangKeluar
        isOpen={showOutModal}
        onClose={() => setShowOutModal(false)}
        onSuccess={fetchDashboardData}
        products={products}
        userId={user?.id_pengguna}
      />
    </div>
  );
}
