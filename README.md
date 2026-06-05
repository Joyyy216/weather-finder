# ⛅ WeatherFinder

WeatherFinder adalah aplikasi cuaca berbasis React Native dan Expo yang menggunakan Open-Meteo API untuk menampilkan informasi cuaca secara real-time berdasarkan nama kota yang dicari pengguna.

Aplikasi ini dibuat sebagai tugas praktikum Pertemuan 10 dengan fokus pada penggunaan React Hooks, useEffect, debounce, API fetching, serta pengembangan fitur tambahan untuk meningkatkan pengalaman pengguna.

---

## 🚀 Fitur Utama (Level 1)

* Controlled TextInput (value + onChangeText)
* Debounce 500ms menggunakan setTimeout dan clearTimeout
* useEffect dengan dependency array
* Fetch API 2 langkah:

  * Geocoding API (Nama Kota → Koordinat)
  * Forecast API (Koordinat → Cuaca)
* AbortController pada cleanup function
* Mapping WMO Weather Code ke label cuaca dan emoji
* Menampilkan:

  * Nama Kota
  * Negara
  * Suhu Saat Ini
  * Kondisi Cuaca
* 4 Kondisi UI:

  * Empty State
  * Loading State
  * Success State
  * Error State

---

## ⭐ Fitur Pengembangan (Level 2)

### 🌡️ Suhu Minimum & Maksimum Harian

Menampilkan temperatur minimum dan maksimum harian menggunakan parameter daily dari Open-Meteo API.

### 🧭 Arah dan Kecepatan Angin

Menampilkan kecepatan angin serta mengubah derajat arah angin menjadi arah mata angin (U, TL, T, TG, S, BD, B, BL).

### 🕘 Riwayat Pencarian

Menyimpan hingga 5 kota terakhir yang dicari dan dapat dipilih kembali dengan satu klik.

### 🔄 Refresh Cuaca

Tombol untuk mengambil ulang data cuaca tanpa mengetik ulang nama kota.

### 🎨 Dynamic Background

Background berubah secara otomatis berdasarkan kondisi siang/malam dan kondisi cuaca.

---

## 🌟 Bonus

### Pull To Refresh

Pengguna dapat menarik layar ke bawah untuk memperbarui data cuaca.

---

## 🛠️ Tech Stack

* React Native
* Expo SDK 54
* JavaScript
* Open-Meteo API
* Expo Linear Gradient

---

## 📱 Screenshot

### Empty State

[beranda.jpeg]

### Loading State

(loading.jpeg)

### Success State

(sukses.jpeg)

### Error State

(error.jpeg)

---

## 🌐 Expo Snack

https://snack.expo.dev/@joyyy21/-weather-finder

---

## ▶️ Cara Menjalankan

1. Clone repository

```bash
git clone https://github.com/Joyyy216/weather-finder.git
```

2. Masuk ke folder project

```bash
cd weather-finder
```

3. Install dependencies

```bash
npm install
```

4. Jalankan aplikasi

```bash
npx expo start
```

5. Scan QR Code menggunakan Expo Go

---

## 📌 API yang Digunakan

### Geocoding API

```text
https://geocoding-api.open-meteo.com/v1/search
```

### Forecast API

```text
https://api.open-meteo.com/v1/forecast
```

---

## 👩‍💻 Author

Joyce Putri

Universitas Prima Indonesia
