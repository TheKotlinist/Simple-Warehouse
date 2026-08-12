'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'supervisor') {
        router.push('/dashboard/supervisor');
      } else {
        router.push('/dashboard/staff');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login gagal. Silakan periksa kembali email dan password Anda.';
      setError(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-background transition-colors duration-300">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm border border-primary/20">
            <KeyRound className="size-6" />
          </div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
            Simple Warehouse
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Silakan masuk untuk mengelola inventaris gudang
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="size-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                  <KeyRound className="size-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Butuh akun baru? Hubungi supervisor Anda untuk didaftarkan.
        </p>
      </div>
    </main>
  );
}
