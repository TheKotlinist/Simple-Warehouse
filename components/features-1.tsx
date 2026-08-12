import { Card } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { Vercel } from '@/components/ui/svgs/vercel'
import { Supabase } from '@/components/ui/svgs/supabase'
import { Linear } from '@/components/ui/svgs/linear'
import { Slack } from '@/components/ui/svgs/slack'
import { Firebase } from '@/components/ui/svgs/firebase'
import { ClerkIconDark as Clerk } from '@/components/ui/svgs/clerk'

export default function Features() {
    return (
        <section id="features" className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div>
                    <h2 className="text-balance font-serif text-4xl font-medium">Fitur Unggulan Manajemen Gudang</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Semua alat yang Anda butuhkan untuk melacak stok barang, mengelola pengguna, dan memantau riwayat transaksi secara real-time.</p>
                </div>
                <div className="@xl:grid-cols-2 mt-12 grid gap-3 *:p-6">
                    <Card
                        variant="outline"
                        className="row-span-2 grid grid-rows-subgrid"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Integrasi API Cepat</h3>
                            <p className="text-muted-foreground text-sm">Komunikasi mulus antara Next.js frontend dengan Express backend API yang aman.</p>
                        </div>
                        <div
                            aria-hidden
                            className="**:fill-foreground flex h-44 flex-col justify-between pt-8"
                        >
                            <div className="relative flex h-10 items-center gap-12 px-6">
                                <div className="bg-border absolute inset-0 my-auto h-px" />

                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Vercel className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Slack className="size-3.5" />
                                </div>
                            </div>
                            <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
                                <div className="bg-border absolute inset-0 my-auto h-px" />

                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Clerk className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Linear className="size-3.5" />
                                </div>
                            </div>
                            <div className="relative flex h-10 items-center gap-20 px-8">
                                <div className="bg-border absolute inset-0 my-auto h-px" />

                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Supabase className="size-3.5" />
                                </div>
                                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Firebase className="size-3.5" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        variant="outline"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Sinkronisasi Stok Real-Time</h3>
                            <p className="text-muted-foreground text-sm">Jumlah fisik stok produk otomatis berubah sesaat setelah transaksi masuk atau keluar dicatat oleh petugas.</p>
                        </div>
                        <div
                            aria-hidden
                            className="relative h-44 translate-y-6"
                        >
                            <div className="bg-foreground/15 absolute inset-0 mx-auto w-px" />
                            <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border" />
                            <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border" />
                            <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border" />
                            <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-lime-500" />
                        </div>
                    </Card>
                    <Card
                        variant="outline"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden"
                    >
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Proteksi & Otorisasi Peran</h3>
                            <p className="text-muted-foreground mt-2 text-sm">Pembatasan ketat antara Staff Gudang dan Supervisor. Supervisor memiliki wewenang penuh atas master data dan laporan.</p>
                        </div>
                        <div
                            aria-hidden
                            className="*:bg-foreground/15 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px"
                        >
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-primary!" />
                        </div>
                    </Card>
                    <Card
                        variant="outline"
                        className="row-span-2 grid grid-rows-subgrid "
                    >
                        <div className="space-y-2">
                            <h3 className="font-medium">Laporan Stok Minimum</h3>
                            <p className="text-muted-foreground text-sm">Dapatkan notifikasi instan dan laporan khusus untuk produk-produk yang stoknya menipis di bawah batas minimum.</p>
                        </div>

                        <div className="pointer-events-none relative mx-auto flex size-44 items-center justify-center pt-5">
                            <Shield className="absolute inset-0 top-2.5 size-full stroke-[0.1px] opacity-15" />
                            <Shield className="size-32 stroke-[0.1px]" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
