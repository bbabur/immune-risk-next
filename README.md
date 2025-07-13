# İmmün Yetmezlik Risk Değerlendirme Sistemi

Bu proje, çocuk hastalarda primer immün yetmezlik riski taşıyan hastaları erken dönemde tespit etmek için Next.js ve Prisma kullanılarak geliştirilmiş bir web uygulamasıdır.

## Teknoloji Stack

- **Frontend**: Next.js 15, React 19, Material-UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Deployment**: Render.com

## Geliştirme Ortamı

### Gereksinimler
- Node.js 18+
- PostgreSQL 12+
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd immune-risk-next
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ı ayarlayın:
```bash
# .env.local dosyası oluşturun
DATABASE_URL="postgresql://username:password@localhost:5432/immune_risk_next?schema=public"
NODE_ENV=development
```

4. Prisma setup:
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
immune-risk-next/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   ├── patients/   # Hasta API'leri
│   │   ├── evaluate/   # Risk değerlendirme API'si
│   │   └── stats/      # İstatistik API'leri
│   ├── patients/       # Hasta sayfaları
│   ├── login/          # Giriş sayfası
│   └── register/       # Kayıt sayfası
├── components/         # Yeniden kullanılabilir bileşenler
├── lib/               # Utility fonksiyonlar
│   └── prisma.ts      # Prisma client
├── prisma/            # Prisma konfigürasyonu
│   ├── schema.prisma  # Veritabanı şeması
│   ├── migrations/    # Veritabanı migrasyonları
│   └── seed.ts        # Seed verileri
└── render.yaml        # Render deployment konfigürasyonu
```

## Render.com'da Deployment

### Adım 1: GitHub Repository
1. Projeyi GitHub'da bir repository'ye push edin
2. `render.yaml` dosyasının proje root'unda olduğundan emin olun

### Adım 2: Render'da Proje Oluşturma
1. [Render.com](https://render.com)'a giriş yapın
2. "New" → "Blueprint" seçin
3. GitHub repository'nizi seçin
4. `render.yaml` dosyası otomatik olarak algılanacak

### Adım 3: Environment Variables
Render dashboard'da şu environment variables'ları ayarlayın:
- `DATABASE_URL` (PostgreSQL bağlantı string'i)
- `NODE_ENV=production`

### Adım 4: Build & Deploy
```bash
# Build komutu (otomatik çalışır)
npm install && npx prisma generate && npm run build

# Start komutu (otomatik çalışır)
npm start
```

## Veritabanı Migrasyonları

### Yerel Geliştirme
```bash
# Yeni migration oluştur
npx prisma migrate dev --name migration_name

# Prisma client'ı yenile
npx prisma generate

# Veritabanını seed et
npm run prisma:seed
```

### Production (Render)
```bash
# Production migrasyonları
npx prisma migrate deploy
```

## Özellikler

- 👥 **Hasta Yönetimi**: Hasta bilgilerini ekleme, düzenleme, görüntüleme
- 🔬 **Laboratuvar Sonuçları**: Lab değerlerini kaydetme ve takip etme
- 📊 **Risk Değerlendirmesi**: Otomatik risk skoru hesaplama
- 📈 **İstatistikler**: Hasta sayıları ve risk dağılımları
- 🔐 **Güvenlik**: Kullanıcı kimlik doğrulama
- 📱 **Responsive**: Mobil uyumlu tasarım

## Destek

Sorularınız için:
- GitHub Issues'ı kullanın
- Dokümantasyonu inceleyin
