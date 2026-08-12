'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { 
  Package, LogOut, ArrowRight, RefreshCw, X, User, 
  MapPin, Shield, CheckCircle2, AlertCircle, Menu, 
  FolderOpen, Truck, Users, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StaffDashboardPage from '../staff/page';

import LaporanStokMinimum from '@/components/dashboard/laporan-stok-minimum';
import CrudProduk from '@/components/dashboard/crud-produk';
import CrudKategori from '@/components/dashboard/crud-kategori';
import CrudSupplier from '@/components/dashboard/crud-supplier';
import CrudRak from '@/components/dashboard/crud-rak';
import CrudPengguna from '@/components/dashboard/crud-pengguna';

type TabType = 'overview' | 'laporan' | 'produk' | 'kategori' | 'supplier' | 'rak' | 'pengguna';

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

interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  kontak: string;
  alamat: string;
}

interface Rack {
  id_lokasi: number;
  kode_rak: string;
  zona: string;
  kapasitas: number;
}

interface UserProfile {
  id_pengguna: number;
  nama: string;
  email: string;
  role: 'supervisor' | 'staff_gudang';
  is_active: boolean;
}

export default function SupervisorDashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [reportTotal, setReportTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== 'supervisor') {
        router.push('/dashboard/staff');
      } else {
        loadAllData();
      }
    }
  }, [user, loading, router]);

  const loadAllData = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const [prod, cat, sup, rk, usr, rpt] = await Promise.all([
        api.get('/produk'),
        api.get('/kategori'),
        api.get('/supplier'),
        api.get('/rak'),
        api.get('/pengguna'),
        api.get('/laporan/stok-minimum')
      ]);
      setProducts(prod || []);
      setCategories(cat || []);
      setSuppliers(sup || []);
      setRacks(rk || []);
      setUsers(usr || []);
      setLowStockProducts(rpt?.data || []);
      setReportTotal(rpt?.total || 0);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || 'Gagal memuat beberapa data dari backend');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSuccessMsg = (msg: string | null) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StaffDashboardPage isEmbedded={true} />;
      
      case 'laporan':
        return <LaporanStokMinimum lowStockProducts={lowStockProducts} reportTotal={reportTotal} />;

      case 'produk':
        return (
          <CrudProduk
            products={products}
            categories={categories}
            racks={racks}
            onRefresh={loadAllData}
            setError={setActionError}
            setSuccess={triggerSuccessMsg}
          />
        );

      case 'kategori':
        return (
          <CrudKategori
            categories={categories}
            onRefresh={loadAllData}
            setError={setActionError}
            setSuccess={triggerSuccessMsg}
          />
        );

      case 'supplier':
        return (
          <CrudSupplier
            suppliers={suppliers}
            onRefresh={loadAllData}
            setError={setActionError}
            setSuccess={triggerSuccessMsg}
          />
        );

      case 'rak':
        return (
          <CrudRak
            racks={racks}
            onRefresh={loadAllData}
            setError={setActionError}
            setSuccess={triggerSuccessMsg}
          />
        );

      case 'pengguna':
        return (
          <CrudPengguna
            users={users}
            onRefresh={loadAllData}
            setError={setActionError}
            setSuccess={triggerSuccessMsg}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-6 py-6 border-b border-border bg-muted/10">
            <div className="flex items-center justify-center size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl">
              <Shield className="size-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-foreground">Simple Warehouse</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Control Center</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <Package className="size-4" />
                <span>Dashboard Staff</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>

            <button
              onClick={() => { setActiveTab('laporan'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'laporan' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="size-4" />
                <span>Laporan Stok Min</span>
              </div>
              {reportTotal > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'laporan' ? 'bg-primary-foreground text-primary font-bold' : 'bg-amber-500 text-white font-bold animate-pulse'}`}>
                  {reportTotal}
                </span>
              )}
            </button>

            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border/50 mt-4">
              Kelola Master Data
            </div>

            <button
              onClick={() => { setActiveTab('produk'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'produk' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <Package className="size-4" />
                <span>Produk</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>

            <button
              onClick={() => { setActiveTab('kategori'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'kategori' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="size-4" />
                <span>Kategori</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>

            <button
              onClick={() => { setActiveTab('supplier'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'supplier' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <Truck className="size-4" />
                <span>Supplier</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>

            <button
              onClick={() => { setActiveTab('rak'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'rak' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="size-4" />
                <span>Lokasi Rak</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>

            <button
              onClick={() => { setActiveTab('pengguna'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'pengguna' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="size-4" />
                <span>Pengguna (Users)</span>
              </div>
              <ChevronRight className="size-4 opacity-50" />
            </button>
          </nav>

          <div className="p-4 border-t border-border bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                  {user?.nama?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">{user?.nama}</p>
                  <p className="text-[10px] text-muted-foreground">Supervisor</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                title="Keluar"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/75 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg border border-border md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <span>Workspace Supervisor</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Refresh All Master Data"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </header>

        {actionError && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-destructive/50 hover:text-destructive">
              <X className="size-4" />
            </button>
          </div>
        )}
        {actionSuccess && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
