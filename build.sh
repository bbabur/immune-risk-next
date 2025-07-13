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
sleep 10

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!" 