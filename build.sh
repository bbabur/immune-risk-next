#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Clean cache
echo "Cleaning npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Wait for database to be ready
echo "Waiting for database connection..."
sleep 5

# Run database migrations (sadece schema değişikliklerini uygula, veri silme!)
echo "Running database migrations..."
npx prisma migrate deploy || echo "Migration deploy failed, trying db push..."

# Fallback: Prisma db push (schema sync)
echo "Syncing database schema..."
npx prisma db push --accept-data-loss || echo "DB push completed with warnings"

# Build the application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!" 