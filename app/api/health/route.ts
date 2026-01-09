import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, string | boolean> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
  };

  // Database bağlantı kontrolü
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'connected';
  } catch (error) {
    checks.database = 'error';
    checks.databaseError = error instanceof Error ? error.message : 'Unknown error';
  }

  // ML Service kontrolü
  const mlUrl = process.env.ML_SERVICE_URL;
  checks.mlServiceUrl = mlUrl ? 'configured' : 'not configured';

  if (mlUrl) {
    try {
      const response = await fetch(`${mlUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        checks.mlService = 'connected';
      } else {
        checks.mlService = `error: ${response.status}`;
      }
    } catch (error) {
      checks.mlService = 'unreachable';
    }
  }

  const allOk = checks.database === 'connected';
  
  return NextResponse.json(checks, { 
    status: allOk ? 200 : 503 
  });
}


