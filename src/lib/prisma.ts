import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Database URL'e SSL parametresi ekle (production için)
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || '';
  
  // Eğer URL zaten sslmode içeriyorsa, olduğu gibi kullan
  if (url.includes('sslmode=')) {
    return url;
  }
  
  // Production'da SSL gerekli
  if (process.env.NODE_ENV === 'production' && url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}sslmode=require`;
  }
  
  return url;
}

// Production için optimize edilmiş Prisma client
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

// Development'ta global'de sakla (hot reload için)
// Production'da her zaman yeni instance
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 