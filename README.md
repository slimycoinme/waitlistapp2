# Waitlist App

DO NOT DELETE without my approval!


A secure and scalable waitlist application built with React and SQLite that allows users to join a waitlist and track their position. Users can refer others to move up in the queue.

## Features

- Join waitlist with name and email
- Get a unique referral code
- Share referral code with others
- Track position in waitlist
- Move up in queue when others use your referral code
- Provide feedback (optional)
- Automated database backups
- Rate limiting and security features

## Tech Stack

### Frontend
- React (Vite)
- Material UI
- React Toastify
- Axios for API calls
- TailwindCSS

### Backend
- Express.js
- SQLite (better-sqlite3)
- Security middleware:
  - Helmet (HTTP headers)
  - Rate limiting
  - CORS protection
  - Input sanitization
  - Error handling

## Security Features

1. **API Protection**:
   - Rate limiting (100 requests per 15 minutes per IP)
   - Input sanitization
   - Payload size limits (10KB)
   - Secure HTTP headers

2. **Database Security**:
   - Automated backups
   - Data validation
   - SQL injection protection
   - Secure file permissions

3. **CORS Protection**:
   - Configurable allowed origins
   - Limited HTTP methods
   - Preflight caching

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd waitlist-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit .env with your configuration:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/waitlist.db
BACKUP_DIR=./data/backups
ALLOWED_ORIGINS=http://localhost:5173
```

## Development

1. Start the backend server:
```bash
npm run server
```

2. Start the frontend development server:
```bash
npm run dev
```

## Deployment Guide

### Prerequisites
- Node.js 16+ and npm
- Git
- PM2 or similar process manager
- Reverse proxy (e.g., Nginx)
- SSL certificate

### Production Deployment Steps

1. **Server Setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade

   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Application Deployment**:
   ```bash
   # Clone repository
   git clone <repository-url>
   cd waitlist-app

   # Install dependencies
   npm install

   # Build frontend
   npm run build

   # Set up environment
   cp .env.example .env
   nano .env  # Edit with production values

   # Start application
   pm2 start server/index.js --name waitlist-app
   pm2 save
   ```

3. **Nginx Configuration**:
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           root /path/to/waitlist-app/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Database Backup**:
   ```bash
   # Set up backup directory
   mkdir -p /path/to/backups
   chown -R nodejs:nodejs /path/to/backups

   # Test backup system
   node server/backup-db.js
   ```

5. **Security Checklist**:
   - [ ] SSL certificate installed
   - [ ] Firewall configured
   - [ ] Environment variables set
   - [ ] Backup system tested
   - [ ] File permissions set
   - [ ] Rate limiting configured
   - [ ] CORS origins set

### Monitoring

1. **PM2 Status**:
   ```bash
   pm2 status
   pm2 logs waitlist-app
   ```

2. **Nginx Logs**:
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   ```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details
