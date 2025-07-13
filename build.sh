#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build

echo "Build completed successfully!" 