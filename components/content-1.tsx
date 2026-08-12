export default function Content() {
    return (
        <section id="workflow" className="bg-background @container py-24">
            <div className="@2xl:grid-cols-2 mx-auto grid max-w-3xl gap-6 px-6">
                <h2 className="text-balance font-serif text-4xl font-medium pt-12">Optimasi Alur Kerja Gudang</h2>

                <div className="flex flex-col gap-6">
                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Pemantauan Akurat</span> Pantau riwayat transaksi masuk dan keluar secara menyeluruh untuk mencegah selisih stok fisik.
                    </p>

                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Pengendalian Risiko</span> Kurangi kesalahan input dan kelola tingkat stok minimum secara preventif untuk kelancaran logistik.
                    </p>

                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Manajemen Tata Letak</span> Organisasikan barang dengan efisien menggunakan pemetaan lokasi zona rak gudang.
                    </p>
                </div>
            </div>
        </section>
    )
}
