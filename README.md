# Sistem Rekap Uang Kardus — Biru & Pink (v1.4)

Aplikasi web untuk penggunaan pribadi pada **satu perangkat dan satu browser**, tanpa login dan tanpa database online.

## Desain v1.4
- Header dan tombol disusun ulang agar tidak menyempit di layar HP.
- Filter dan tabel transaksi lebih nyaman pada layar kecil; tabel dapat digeser mendatar.

## Desain v1.2
- Warna dominan biru dan pink.
- Tampilan responsif untuk laptop dan HP, dengan navigasi bawah pada layar kecil.

## Fitur
- Dashboard pemasukan, pengeluaran, saldo, dan grafik bulanan.
- Tambah, edit, hapus, pencarian, filter bulan/jenis, dan saldo berjalan.
- Rekap tahunan dan ekspor CSV untuk dibuka di Excel.
- **Cadangkan Data**: simpan seluruh transaksi sebagai file JSON.
- **Pulihkan**: pulihkan transaksi dari JSON; data saat ini akan diganti setelah konfirmasi.
- Penyimpanan lokal melalui `localStorage`.
- PWA/offline sederhana setelah dibuka pertama kali melalui HTTPS, di browser yang sama dan selama cache browser tersedia.

## Publikasi gratis melalui GitHub Pages
1. Buat repository GitHub baru, misalnya `rekap-uang-kardus`.
2. Ekstrak ZIP ini dan unggah **isi folder** `sistem-rekap-uang-kardus` ke root repository. Pastikan `index.html` berada langsung di root.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
6. Tunggu hingga GitHub Pages memberikan alamat, biasanya `https://USERNAME.github.io/rekap-uang-kardus/`.

## Penyimpanan data — penting
- Website online tidak berarti data transaksi disimpan online. Data **hanya tersimpan di browser/perangkat ini**, tidak diunggah ke GitHub atau server.
- Gunakan browser dan perangkat yang sama. Jangan gunakan mode incognito/private.
- Jangan hapus data situs/browser sebelum membuat cadangan.
- Klik **Cadangkan Data** secara rutin dan simpan file `.json` di tempat aman. CSV untuk dibaca di Excel; JSON untuk pemulihan aplikasi.
- **Pulihkan** akan mengganti seluruh data transaksi saat ini dengan isi cadangan.
- Jika membuka situs di browser/perangkat lain, transaksi tidak otomatis muncul.

## Isi proyek
- `index.html` — struktur halaman.
- `assets/style.css` — desain responsif.
- `assets/app.js` — logika transaksi, laporan, ekspor dan pemulihan.
- `manifest.webmanifest` — metadata aplikasi.
- `service-worker.js` — cache/offline sederhana.
- `assets/icon.svg` — ikon aplikasi.


### Perbaikan v1.4
- Header dan tombol tindakan dibuat lebih stabil pada layar HP kecil.
- Kartu statistik dan filter menggunakan lebar layar yang tersedia.
- Tabel transaksi tetap dapat digeser ke samping tanpa memperlebar seluruh halaman.
- Cache service worker diperbarui agar versi baru dapat dimuat.


### Perubahan v1.5
- Menghapus strip tombol Cadangkan Data, Pulihkan, Ekspor CSV, dan Tambah transaksi dari header global pada semua menu.
- Navigasi utama dan halaman transaksi tetap tersedia.


### Desain v2.0 — Elegan Biru & Pink
- Penyegaran visual dengan warna biru navy, biru cerah, dan aksen pink.
- Kartu ringkasan, panel, filter, tombol, dan navigasi diberi jarak, radius, serta kontras yang lebih konsisten.
- Responsif untuk layar ponsel; tabel tetap dapat digeser horizontal tanpa memperlebar halaman.
- Versi cache service worker diperbarui agar CSS baru dimuat.


### Perbaikan v2.1
- Memperbaiki JavaScript agar tetap berjalan ketika tombol Cadangkan/Pulihkan/Ekspor global disembunyikan.
- Tombol Tambah transaksi di halaman Transaksi tetap berfungsi.
- Cache service worker diperbarui.


### Perbaikan tombol v2.2
- Event tombol tambah transaksi diperkuat dengan event delegation dan fallback dialog.
- Versi URL JavaScript/CSS dan cache service worker diperbarui untuk mencegah kode lama tetap dipakai.


### v2.4 - pembaruan cache aman
Memaksa pemeriksaan versi service worker dan menyegarkan cache aset aplikasi. Cache Storage lama aplikasi dibersihkan saat aktivasi; localStorage transaksi tidak disentuh.


### v2.5 — perbaikan tombol tutup dan batal
Menambahkan penanganan klik cadangan untuk tombol X dan Batal. Data transaksi lokal tidak dihapus.
