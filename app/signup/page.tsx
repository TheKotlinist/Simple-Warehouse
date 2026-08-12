'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
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
          <div className="flex items-center justify-center size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 mb-4 shadow-sm border border-amber-500/20">
            <UserPlus className="size-6" />
          </div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
            Pendaftaran Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Warehouse Management System
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none text-center space-y-6">
          <div className="flex flex-col items-center justify-center text-amber-600 dark:text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
            <ShieldAlert className="size-10 mb-3" />
            <h2 className="font-semibold text-lg text-foreground">Akses Terbatas</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Pendaftaran akun baru tidak dapat dilakukan secara mandiri untuk menjaga keamanan data inventaris gudang.
            </p>
          </div>

          <div className="text-sm text-foreground/80 leading-relaxed text-left bg-muted/50 rounded-2xl p-5 border border-border/50">
            <p className="font-medium mb-2 text-foreground">Bagaimana cara mendapatkan akun?</p>
            <ol className="list-decimal pl-4 space-y-1.5 text-muted-foreground">
              <li>Hubungi administrator atau <strong>Supervisor Gudang</strong> Anda.</li>
              <li>Berikan nama, email, dan mintalah penentuan peran (Staff Gudang atau Supervisor).</li>
              <li>Supervisor akan mendaftarkan Anda melalui menu <strong>Kelola Pengguna</strong>.</li>
              <li>Gunakan email dan password yang diberikan untuk masuk ke sistem.</li>
            </ol>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none transition-all cursor-pointer"
            >
              Sudah Punya Akun? Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
