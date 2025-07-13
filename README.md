# Immune Risk Assessment System

Bu proje, immün yetmezlik riski değerlendirmesi için geliştirilmiş bir Next.js uygulamasıdır.

## Geliştirme Ortamı

### Gereksinimler
- Node.js 18+
- npm
- PostgreSQL (production) veya SQLite (development)

### Kurulum

1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd immune-risk-next
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Veritabanını ayarlayın:
```bash
npx prisma migrate dev
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Render.com'da Deployment

### Otomatik Deployment (Önerilen)

1. GitHub'da projenizi yayınlayın
2. Render.com hesabınıza giriş yapın
3. "New" > "Blueprint" seçin
4. GitHub repository'nizi seçin
5. `render.yaml` dosyası otomatik olarak algılanacak
6. "Apply" butonuna tıklayın

### Manuel Deployment

1. Render.com'da yeni bir "Web Service" oluşturun
2. GitHub repository'nizi bağlayın
3. Ayarları yapın:
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18 veya üzeri

4. PostgreSQL veritabanı oluşturun:
   - "New" > "PostgreSQL" seçin
   - Veritabanı bilgilerini not edin

5. Environment Variables'ı ayarlayın:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: production
   - `NEXTAUTH_URL`: https://your-app-name.onrender.com
   - `NEXTAUTH_SECRET`: Random string

### Environment Variables

Production ortamda aşağıdaki environment variables'ları ayarlayın:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your-secret-key
```

## Veritabanı Migrasyonları

Production'da veritabanı migrasyonları build sırasında otomatik olarak çalışır:

```bash
npm run build  # prisma migrate deploy && next build
```

## Özellikler

- Hasta kayıt sistemi
- Risk değerlendirme algoritmaları
- Klinik özellik takibi
- Laboratuvar sonuçları
- Hastane yatışları
- Enfeksiyon takibi
- Aile anamnezi
- Aşılama geçmişi

## Teknolojiler

- Next.js 15
- React 19
- Prisma ORM
- PostgreSQL
- Material-UI
- Tailwind CSS
- TypeScript

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
