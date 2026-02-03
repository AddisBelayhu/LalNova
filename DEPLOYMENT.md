# 🚀 LalNova Technologies - Production Deployment Guide

## Prerequisites

- Node.js 18+ installed on your server
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Web server (Nginx recommended)

## Quick Deployment Steps

### 1. Prepare Environment Files

Update the following files with your production values:

**`.env.production`:**
```env
NODE_ENV=production
DATABASE_URL="file:./prod.db"
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

**`client/.env.production`:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
GENERATE_SOURCEMAP=false
```

### 2. Build and Deploy

Run the deployment script:

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

### 3. Server Setup Options

#### Option A: Using PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### Option B: Using systemd (Linux)

Create `/etc/systemd/system/lalnova.service`:
```ini
[Unit]
Description=LalNova Technologies
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/app
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable lalnova
sudo systemctl start lalnova
```

### 4. Web Server Configuration

#### Nginx Setup

1. Copy `nginx.conf` to `/etc/nginx/sites-available/lalnova`
2. Update domain name and SSL certificate paths
3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/lalnova /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5. Database Setup

The SQLite database will be created automatically. For production, consider:

- Regular backups of `server/prisma/prod.db`
- Moving to PostgreSQL/MySQL for better performance

### 6. Monitoring and Maintenance

#### Health Check
Visit: `https://yourdomain.com/api/health`

#### Logs
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`

#### Updates
```bash
git pull origin main
npm run build
pm2 restart lalnova-backend
```

## Hosting Providers

### Recommended Providers:

1. **DigitalOcean** - $5/month droplet
2. **Linode** - $5/month VPS
3. **AWS EC2** - t3.micro (free tier)
4. **Heroku** - Easy deployment
5. **Vercel** - Frontend + Serverless functions

### Domain Providers:

1. **Namecheap** - Affordable domains
2. **Cloudflare** - Domain + CDN
3. **GoDaddy** - Popular choice

## Security Checklist

- ✅ Change default admin credentials
- ✅ Use strong JWT secret
- ✅ Enable HTTPS/SSL
- ✅ Configure firewall (UFW/iptables)
- ✅ Regular security updates
- ✅ Database backups
- ✅ Monitor logs

## Performance Optimization

- ✅ Gzip compression enabled
- ✅ Static asset caching
- ✅ CDN for images (optional)
- ✅ Database indexing
- ✅ PM2 cluster mode

## Troubleshooting

### Common Issues:

1. **Port 5000 already in use**
   - Change PORT in .env.production

2. **Database connection errors**
   - Check DATABASE_URL path
   - Ensure write permissions

3. **CORS errors**
   - Update CORS_ORIGIN in .env.production

4. **SSL certificate issues**
   - Verify certificate paths in nginx.conf
   - Check certificate expiration

### Support

For deployment support, check:
- Server logs: `pm2 logs` or `journalctl -u lalnova`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Application health: `https://yourdomain.com/api/health`

## Cost Estimation

**Monthly Costs:**
- Domain: $10-15/year
- VPS Hosting: $5-20/month
- SSL Certificate: Free (Let's Encrypt)
- **Total: ~$5-25/month**

Your LalNova Technologies website is now ready for production! 🎉