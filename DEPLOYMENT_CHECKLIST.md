# 🚀 Sahyog Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## 📋 Pre-Deployment Checklist

### 1. Code Review
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] All API endpoints working
- [ ] Authentication flow working
- [ ] Forms validating properly
- [ ] Error handling in place

### 2. Environment Setup
- [ ] Production `.env` file created
- [ ] All environment variables set
- [ ] Secrets are secure and random
- [ ] MongoDB connection string updated
- [ ] Google OAuth redirect URIs updated
- [ ] CLIENT_URL updated to production domain
- [ ] NODE_ENV set to "production"

### 3. Database
- [ ] MongoDB Atlas cluster created (or production DB ready)
- [ ] Database user created with proper permissions
- [ ] IP whitelist configured
- [ ] Connection string tested
- [ ] Indexes created (automatic with Mongoose)
- [ ] Backup strategy in place

### 4. Google OAuth
- [ ] Production domain added to authorized domains
- [ ] Redirect URIs updated:
  - `https://yourdomain.com/auth/google/callback`
  - `https://yourdomain.com/auth/callback`
- [ ] OAuth consent screen configured
- [ ] Privacy policy URL added (if required)
- [ ] Terms of service URL added (if required)

### 5. Security
- [ ] All secrets are environment variables
- [ ] No hardcoded credentials in code
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Secure cookies enabled (production)
- [ ] Rate limiting considered
- [ ] Input validation on all forms

### 6. Frontend Build
- [ ] Run `npm run build` successfully
- [ ] Build folder created
- [ ] No build errors
- [ ] Assets optimized
- [ ] API URLs point to production

---

## 🌐 Deployment Options

### Option 1: Heroku (Full Stack)

#### Setup
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create sahyog-app

# Add MongoDB addon or use Atlas
heroku addons:create mongolab

# Set environment variables
heroku config:set GOOGLE_CLIENT_ID=your_id
heroku config:set GOOGLE_CLIENT_SECRET=your_secret
heroku config:set JWT_SECRET=your_secret
heroku config:set SESSION_SECRET=your_secret
heroku config:set CLIENT_URL=https://sahyog-app.herokuapp.com

# Deploy
git push heroku main
```

#### Checklist
- [ ] Heroku account created
- [ ] App created on Heroku
- [ ] Environment variables set
- [ ] MongoDB configured
- [ ] Procfile created (if needed)
- [ ] Build successful
- [ ] App accessible

---

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client folder
cd client
vercel
```

**Vercel Checklist:**
- [ ] Vercel account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables set:
  - `REACT_APP_API_URL=https://your-backend.railway.app`
- [ ] Domain configured
- [ ] Deployment successful

#### Backend (Railway)
1. Go to railway.app
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Configure domain

**Railway Checklist:**
- [ ] Railway account created
- [ ] Project created
- [ ] GitHub repo connected
- [ ] Environment variables set
- [ ] MongoDB plugin added or Atlas connected
- [ ] Domain configured
- [ ] Deployment successful

---

### Option 3: DigitalOcean / AWS / VPS

#### Server Setup
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# Follow MongoDB installation guide

# Clone repository
git clone your-repo-url
cd sahyog

# Install dependencies
npm run install-all

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Build frontend
cd client && npm run build && cd ..

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server/index.js --name sahyog

# Setup Nginx reverse proxy
sudo apt install nginx
# Configure Nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**VPS Checklist:**
- [ ] Server provisioned
- [ ] Node.js installed
- [ ] MongoDB installed/configured
- [ ] Code deployed
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] PM2 configured
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Domain DNS configured

---

## 🔒 Security Hardening

### Production Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] SQL injection protection (MongoDB)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies updated
- [ ] Vulnerable packages fixed

### Recommended Security Headers
```javascript
// Add to Express server
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

---

## 📊 Monitoring & Maintenance

### Post-Deployment Checklist
- [ ] Application accessible
- [ ] All pages loading
- [ ] Authentication working
- [ ] Database operations working
- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] Backup system in place
- [ ] Domain DNS propagated

### Monitoring Tools (Optional)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (New Relic)
- [ ] Log management (Loggly, Papertrail)

### Regular Maintenance
- [ ] Weekly backup verification
- [ ] Monthly dependency updates
- [ ] Security patch reviews
- [ ] Performance optimization
- [ ] Database cleanup
- [ ] Log rotation

---

## 🧪 Testing Checklist

### Pre-Deployment Testing
- [ ] User registration/login
- [ ] Profile creation/editing
- [ ] Skill creation/editing/deletion
- [ ] Help request creation
- [ ] Response submission
- [ ] Helper acceptance
- [ ] Request completion
- [ ] Rating submission
- [ ] Search functionality
- [ ] Filtering functionality
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Post-Deployment Testing
- [ ] Repeat all tests on production
- [ ] Test with real Google accounts
- [ ] Verify email notifications (if implemented)
- [ ] Check SSL certificate
- [ ] Test on different devices
- [ ] Verify all links work
- [ ] Check error pages

---

## 📝 Environment Variables Template

### Production .env
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sahyog

# Google OAuth
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback

# JWT
JWT_SECRET=super_long_random_production_secret_key
JWT_EXPIRE=7d

# Session
SESSION_SECRET=another_super_long_random_secret

# Frontend
CLIENT_URL=https://yourdomain.com
```

---

## 🎯 Go-Live Checklist

### Final Steps Before Launch
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team trained (if applicable)
- [ ] Backup verified
- [ ] Monitoring active
- [ ] Support plan ready
- [ ] Rollback plan prepared

### Launch Day
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Test critical paths
- [ ] Monitor errors
- [ ] Check performance
- [ ] Announce launch

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Address any issues
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Celebrate! 🎉

---

## 🆘 Rollback Plan

### If Something Goes Wrong
1. **Identify the issue**
   - Check error logs
   - Review recent changes
   - Test specific features

2. **Quick fixes**
   - Revert environment variables
   - Restart services
   - Clear caches

3. **Full rollback**
   ```bash
   # Revert to previous version
   git revert HEAD
   git push
   
   # Or restore from backup
   # Restore database
   # Redeploy previous version
   ```

4. **Communication**
   - Notify users (if needed)
   - Update status page
   - Document the issue

---

## 📞 Support Contacts

### Critical Services
- **Domain Registrar:** _____________
- **Hosting Provider:** _____________
- **Database Provider:** _____________
- **Email Service:** _____________
- **DNS Provider:** _____________

### Team Contacts
- **Developer:** _____________
- **DevOps:** _____________
- **Support:** _____________

---

## ✅ Deployment Complete!

Once all items are checked:

- [ ] Application is live
- [ ] All features working
- [ ] Monitoring active
- [ ] Team notified
- [ ] Documentation updated
- [ ] Users can access

**Congratulations on your deployment! 🚀**

---

## 📚 Additional Resources

- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment Guide](https://docs.railway.app/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Let's Encrypt SSL](https://letsencrypt.org/getting-started/)

---

**Remember:** Always test thoroughly before deploying to production!
