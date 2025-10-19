import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// This endpoint auto-initializes the database if empty
export async function POST() {
  try {
    const results: any = {
      users: { status: 'skipped', message: '' },
      trainingData: { status: 'skipped', message: '' }
    };

    // 1. Check and seed users
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const adminPassword = await bcrypt.hash('Admin123456', 10);
      const userPassword = await bcrypt.hash('Mehmet123456', 10);

      await prisma.user.createMany({
        data: [
          {
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
            isActive: true,
          },
          {
            username: 'mehmetbabur',
            email: 'mehmetbabur@example.com',
            password: userPassword,
            role: 'admin',
            isActive: true,
          }
        ]
      });

      results.users = {
        status: 'created',
        message: '2 kullanıcı oluşturuldu'
      };
    } else {
      results.users = {
        status: 'exists',
        message: `${userCount} kullanıcı zaten var`
      };
    }

    // 2. Check training data count
    const trainingCount = await prisma.trainingPatient.count();
    results.trainingData = {
      status: trainingCount === 0 ? 'empty' : 'exists',
      message: trainingCount === 0 
        ? 'Training data boş - /training-data sayfasından yükleyin' 
        : `${trainingCount} eğitim verisi var`,
      count: trainingCount
    };

    return NextResponse.json({
      success: true,
      message: 'Initialization check completed',
      results
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Initialization failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET - Check status only
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const trainingCount = await prisma.trainingPatient.count();
    const patientCount = await prisma.patient.count();

    return NextResponse.json({
      initialized: userCount > 0,
      users: userCount,
      trainingData: trainingCount,
      patients: patientCount,
      needsTrainingData: trainingCount === 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}

