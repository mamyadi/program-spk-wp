# SPK-WP (Sistem Pendukung Keputusan - Weighted Product)

## 📝 Deskripsi Aplikasi

SPK-WP adalah sistem pendukung keputusan berbasis web yang mengimplementasikan metode Weighted Product (WP). Aplikasi ini dirancang untuk membantu pengambilan keputusan dengan mempertimbangkan berbagai kriteria dan alternatif.

### Fitur Utama

- **Manajemen Kriteria**: Penentuan kriteria lengkap dengan kode, nama, bobot, dan tipe (benefit/cost)
- **Manajemen Alternatif**: Pendataan alternatif beserta nilai untuk setiap kriteria
- **Perhitungan WP**: Otomatisasi proses perhitungan dengan metode Weighted Product
- **Visualisasi Hasil**: Tampilan grafik untuk memudahkan interpretasi hasil perhitungan
- **Sistem Autentikasi**: Keamanan aplikasi dengan sistem login

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js, TypeScript, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Autentikasi**: JWT (JSON Web Token)

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14.x atau lebih baru)
- MySQL Server
- Git (opsional, untuk clone repository)

### Langkah 1: Persiapan Database

1. Buat database MySQL baru dengan nama `spk_wp`
2. Import skema database dari file `server/database.sql`:

```bash
mysql -u username -p spk_wp < server/database.sql
```

### Langkah 2: Konfigurasi Server

1. Masuk ke direktori server:

```bash
cd server
```

2. Buat file `.env` (atau sesuaikan file yang sudah ada) dengan isi:

```properties
PORT=5000
DB_HOST=localhost
DB_USER=root         # Sesuaikan dengan user MySQL Anda
DB_PASSWORD=password # Sesuaikan dengan password MySQL Anda
DB_NAME=spk_wp
JWT_SECRET=spk_wp_secret_key_2025  # Anda bisa mengubah secret key ini
```

3. Install dependensi server:

```bash
npm install
```

### Langkah 3: Konfigurasi Frontend

1. Kembali ke direktori utama dan install dependensi frontend:

```bash
cd ..
npm install
```

### Langkah 4: Menjalankan Aplikasi

Terdapat dua cara untuk menjalankan aplikasi:

#### Cara 1: Menjalankan Frontend dan Backend Secara Bersamaan

```bash
npm run start:all
```

#### Cara 2: Menjalankan Frontend dan Backend Secara Terpisah

Terminal 1 (Backend):

```bash
npm run dev:server
```

Terminal 2 (Frontend):

```bash
npm start
```

### Langkah 5: Akses Aplikasi

Buka browser dan akses aplikasi di [http://localhost:3000](http://localhost:3000)

## 👤 Informasi Login

Untuk login ke aplikasi, gunakan kredensial berikut (atau sesuaikan jika Anda telah mengubah data di database):

- **Username**: kelompok1
- **Password**: admin123

## 📊 Cara Penggunaan Aplikasi

1. **Login** ke dalam aplikasi menggunakan kredensial yang telah disediakan
2. **Atur Kriteria**: Tambahkan kriteria penilaian, berikan bobot dan tentukan tipenya (benefit/cost)
3. **Input Alternatif**: Tambahkan alternatif beserta nilai untuk setiap kriteria yang telah ditentukan
4. **Lakukan Perhitungan**: Sistem akan otomatis menghitung menggunakan metode Weighted Product
5. **Lihat Hasil**: Hasil perhitungan akan ditampilkan dalam bentuk tabel dan grafik

## ⚙️ Konfigurasi Tambahan (Opsional)

### Mengubah Port Server

Secara default, server berjalan di port 5000. Untuk mengubahnya, edit file `.env` di folder server.

### Mengubah URL API di Frontend

Secara default, frontend mengakses API di `http://localhost:5000`. Jika port server diubah, perlu menyesuaikan konfigurasi di sisi frontend.

---

## 🔒 Keamanan

Aplikasi menggunakan JWT untuk autentikasi. Token disimpan di localStorage browser. Pastikan untuk mengganti JWT_SECRET di file `.env` server untuk produksi.

## 📝 Catatan Penting

- Aplikasi ini dirancang untuk pengembangan lokal. Diperlukan konfigurasi tambahan untuk deployment ke lingkungan produksi.
- Pastikan keamanan database dengan menggunakan password yang kuat dan membatasi akses ke database server.
