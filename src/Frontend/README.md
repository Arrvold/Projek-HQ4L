# Next.js RPG Game Landing Page Template

Template landing page modern untuk website game RPG yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## ✨ Fitur Utama

- **Header dengan Logo**: Logo lingkaran kuning dan tombol Sign In/Sign Up
- **Hero Section**: Deskripsi aplikasi dalam kotak kuning dengan background gambar
- **Role Selection**: 5 card untuk memilih peran (Codes, Sports, Arts, Traveler, Literature)
- **Dynamic Role Description**: Deskripsi role yang berubah sesuai pilihan user
- **Events Section**: Container untuk menampilkan events dengan gambar dan keterangan
- **Footer**: Footer lengkap dengan informasi game dan statistik
- **Responsive Design**: Fully responsive untuk semua ukuran layar

## 🎮 Komponen Game RPG

### Header
- Logo lingkaran kuning dengan teks "RPG"
- Tombol Sign In dan Sign Up
- Brand name "GameWorld"

### Hero Section
- Background gambar fantasi
- Kotak kuning berisi deskripsi aplikasi
- Tombol CTA "Mulai Petualangan" dan "Pelajari Lebih Lanjut"

### Role Cards
- **Codes**: Ahli teknologi dan programming
- **Sports**: Atlet dengan kekuatan fisik
- **Arts**: Seniman kreatif
- **Traveler**: Petualang dan explorer
- **Literature**: Ahli komunikasi dan analisis

### Role Description
- Deskripsi detail setiap role
- Kemampuan utama dalam bentuk badges
- Berubah secara dinamis saat role dipilih

### Events Section
- Gambar event di bagian kiri
- Keterangan lengkap event di bagian kanan
- Informasi tanggal, lokasi, peserta, dan rating

### Footer
- Informasi game dan community
- Statistik pemain aktif
- Social media links
- Link kategori game

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Jalankan development server**
   ```bash
   npm run dev
   ```

3. **Buka browser**
   Navigate ke [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
rpg-landing-page/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles dan Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page dengan state management
├── components/             # UI components
│   ├── Header.tsx         # Header dengan logo dan tombol auth
│   ├── Hero.tsx           # Hero section dengan background image
│   ├── RoleCards.tsx      # 5 role cards yang bisa diklik
│   ├── RoleDescription.tsx # Deskripsi role yang dinamis
│   ├── Events.tsx         # Events section dengan gambar dan info
│   └── Footer.tsx         # Footer dengan statistik game
├── package.json            # Dependencies dan scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Dokumentasi ini
```

## 🎨 Customization

### Warna
Edit skema warna di `tailwind.config.js`:
```javascript
colors: {
  yellow: {
    400: '#fbbf24',  // Warna utama
    500: '#f59e0b',
  }
}
```

### Content
- Update teks deskripsi di setiap komponen
- Ganti gambar background di `components/Hero.tsx`
- Modifikasi deskripsi role di `components/RoleDescription.tsx`
- Update events di `components/Events.tsx`

### Styling
- Gunakan utility classes Tailwind CSS
- Tambahkan custom CSS di `app/globals.css`
- Update design system di `tailwind.config.js`

## 🔧 State Management

Template menggunakan React hooks untuk state management:
- `selectedRole`: Menyimpan role yang sedang dipilih
- `handleRoleSelect`: Function untuk mengubah role yang dipilih
- Props passing antara `RoleCards` dan `RoleDescription`

## 📱 Responsive Features

- Mobile-first design approach
- Grid layouts yang responsive
- Typography yang adaptif
- Touch-friendly interactions
- Optimized spacing untuk semua ukuran layar

## 🚀 Deployment

### Build untuk Production
```bash
npm run build
```

### Deploy ke Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke [Vercel](https://vercel.com)
3. Deploy otomatis setiap push

### Platform Lain
- **Netlify**: Deploy folder `out` setelah build
- **AWS Amplify**: Connect repository untuk auto-deploy
- **Traditional hosting**: Serve static files setelah build

## 🎯 Komponen Interaktif

### Role Selection
- Klik pada role card untuk memilih
- Visual feedback dengan ring kuning
- Deskripsi berubah secara real-time
- Smooth animations dan transitions

### Events Display
- Gambar event yang menarik
- Informasi lengkap setiap event
- Tombol CTA untuk setiap event
- Responsive grid layout

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Lakukan perubahan
4. Test thoroughly
5. Submit pull request

## 📄 License

Template ini open source dan tersedia di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built dengan [Next.js](https://nextjs.org/)
- Styled dengan [Tailwind CSS](https://tailwindcss.com/)
- Icons dari [Lucide React](https://lucide.dev/)
- Fonts dari [Google Fonts](https://fonts.google.com/)

---

**Happy Gaming! 🎮⚔️**

Template ini dibuat khusus untuk penggemar RPG dan game enthusiasts!
