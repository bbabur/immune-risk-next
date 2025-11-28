# Database Migration Rehberi

## ⚠️ ÖNEMLİ: Veri Kaybını Önleme

### Production'da Migration Yaparken:

1. **YEDEK AL:**
```bash
# Render dashboard'dan backup al
# veya
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

2. **Migration'ı Test Et:**
```bash
# Önce local test database'de dene
# Sonra staging'de test et
# En son production'da uygula
```

3. **Rollback Planı Hazırla:**
```sql
-- Her migration için rollback SQL'i yaz
-- Örnek: patients tablosu değişikliği için rollback
ALTER TABLE patients DROP COLUMN IF EXISTS file_number;
ALTER TABLE patients DROP COLUMN IF EXISTS age_years;
-- vs...
```

### Güvenli Migration Adımları:

#### Adım 1: Backup
```bash
node scripts/backup_database.js
```

#### Adım 2: Migration Dosyası Oluştur
```bash
# migrations/ klasörü oluştur
mkdir -p migrations
# Timestamp ile migration dosyası
touch migrations/$(date +%Y%m%d_%H%M%S)_add_file_number.sql
```

#### Adım 3: Migration'ı Uygula
```bash
node scripts/run_migration.js migrations/20241128_add_file_number.sql
```

#### Adım 4: Verify
```bash
node scripts/verify_migration.js
```

## 🔧 Mevcut Durum İçin:

### Kullanıcılar Neden Silindi?

1. `seed_users_pg.js` scripti her çalıştığında **önce tüm kullanıcıları siliyor**
2. Migration sırasında bu script çalıştırıldı
3. Sonuç: Tüm kullanıcılar gitti

### Çözüm:

Seed script'ini güncelle - sadece yoksa ekle, varsa güncelle:

```javascript
// YANLIŞ (mevcut):
await client.query('DELETE FROM users');

// DOĞRU (olması gereken):
await client.query(`
  INSERT INTO users (username, email, password, role, created_at, updated_at)
  VALUES ($1, $2, $3, $4, NOW(), NOW())
  ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW()
`);
```

## 📊 Production Database Yönetimi:

### 1. Separate Environments:
- **Development:** Local PostgreSQL
- **Staging:** Test database (Render)
- **Production:** Production database (Render)

### 2. Migration Tools:
- Prisma Migrate (önerilen)
- Flyway
- Liquibase

### 3. Backup Strategy:
- Günlük otomatik backup
- Migration öncesi manuel backup
- Point-in-time recovery

## 🚨 Acil Durum Planı:

Eğer production'da veri kaybı olursa:

1. **Hemen backup'tan restore et**
2. **Kullanıcılara bildir**
3. **Root cause analysis yap**
4. **Önlem al**

## 📝 Best Practices:

1. ✅ Her zaman backup al
2. ✅ Migration'ları version control'de tut
3. ✅ Test environment'da önce test et
4. ✅ Rollback planı hazırla
5. ✅ Migration'ları küçük parçalara böl
6. ✅ Downtime planlama yap
7. ✅ Monitoring ekle
8. ✅ Dokümante et

