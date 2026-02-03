#!/bin/bash

# Production Deployment Script for LalNova Technologies

echo "🚀 Starting production deployment..."

# Set production environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the React app
echo "🏗️  Building React application..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migrate:prod

# Seed the database
echo "🌱 Seeding database..."
npm run seed

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.production with your domain and secure secrets"
echo "2. Upload files to your server"
echo "3. Run 'npm start' on your server"
echo "4. Configure your web server (Nginx/Apache) to proxy to your app"
echo ""
echo "🌐 Your app will be available at: https://yourdomain.com"