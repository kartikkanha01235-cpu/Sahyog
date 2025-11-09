# Sahyog Platform - Complete Setup Guide

## 🚀 Quick Start

Follow these steps to get Sahyog running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

---

## Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

---

## Step 2: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/sahyog`)
4. Whitelist your IP address in Network Access

---

## Step 3: Configure Google OAuth

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback`
     - `http://localhost:3000/auth/callback`
   - Click "Create"

5. Copy your **Client ID** and **Client Secret**

---

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` file and update with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sahyog
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sahyog

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# JWT Configuration
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=another_random_secret_key_for_sessions

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Generate Secure Secrets

For JWT_SECRET and SESSION_SECRET, use random strings. You can generate them using:

**PowerShell (Windows):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Node.js (Any platform):**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

---

## Step 5: Run the Application

### Development Mode (Recommended)

Open terminal in project root and run:

```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Alternative: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

---

## Step 6: Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. Click "Sign In with Google"
3. Authorize the application
4. Start using Sahyog!

---

## 🎯 Features Overview

### ✅ Implemented Features

1. **User Authentication**
   - Google OAuth sign-in
   - JWT-based session management
   - Secure authentication flow

2. **User Profiles**
   - View and edit profile
   - Add bio, location, languages
   - Reputation system with ratings
   - Profile statistics

3. **Skill Management**
   - Add/edit/delete skills
   - Categorized skills (7 categories)
   - Experience levels
   - Availability settings (Online/In-Person/Both)
   - Skill ratings and reviews

4. **Help Requests**
   - Create detailed help requests
   - Urgency levels (Low/Medium/High)
   - Status tracking (Open/In Progress/Completed/Closed)
   - Location-based requests
   - Timeline preferences

5. **Response System**
   - Respond to help requests
   - Accept helpers
   - Rate completed requests
   - Feedback system

6. **Search & Filtering**
   - Search skills by keyword, category, location
   - Filter help requests by status, urgency, category
   - Advanced filtering options

7. **Modern UI**
   - Responsive design
   - Clean and intuitive interface
   - Mobile-friendly
   - Professional styling

---

## 📁 Project Structure

```
sahyog/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── Skills.js
│   │   │   ├── Requests.js
│   │   │   └── ...
│   │   ├── context/       # React context
│   │   │   └── AuthContext.js
│   │   ├── services/      # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   │   └── passport.js
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Skill.js
│   │   └── HelpRequest.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── skills.js
│   │   └── requests.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   └── index.js          # Server entry point
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError`

**Solution:**
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

### Google OAuth Issues

**Error:** `redirect_uri_mismatch`

**Solution:**
- Verify redirect URIs in Google Cloud Console match exactly:
  - `http://localhost:5000/auth/google/callback`
- Ensure no trailing slashes
- Check GOOGLE_CALLBACK_URL in `.env`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env file
PORT=5001
```

### Module Not Found Errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm run install-all
```

---

## 🚀 Production Deployment

### Environment Variables for Production

Update `.env` for production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
CLIENT_URL=https://your-domain.com
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
```

### Build Frontend

```bash
cd client
npm run build
```

### Deploy Options

1. **Heroku** - Easy deployment for full-stack apps
2. **Vercel/Netlify** - Frontend hosting
3. **Railway/Render** - Backend hosting
4. **DigitalOcean/AWS** - Full control

---

## 📝 API Documentation

### Authentication Endpoints

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/current` - Get current user

### User Endpoints

- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/stats/:id` - Get user statistics

### Skill Endpoints

- `GET /api/skills/categories` - Get all categories
- `POST /api/skills` - Create skill
- `GET /api/skills/user/:userId` - Get user's skills
- `GET /api/skills/search` - Search skills
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Help Request Endpoints

- `POST /api/requests` - Create help request
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/:id` - Get single request
- `GET /api/requests/user/my-requests` - Get user's requests
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/respond` - Respond to request
- `POST /api/requests/:id/accept/:responderId` - Accept responder
- `POST /api/requests/:id/rate` - Rate completed request
- `DELETE /api/requests/:id` - Delete request

---

## 🎨 Customization

### Change Color Scheme

Edit `client/src/index.css` and update color variables:

```css
/* Primary color */
.btn-primary {
  background-color: #your-color;
}

/* Update gradients */
background: linear-gradient(135deg, #color1 0%, #color2 100%);
```

### Add New Skill Categories

Edit `server/models/Skill.js`:

```javascript
const skillCategories = [
  'Technical Skills',
  'Creative Skills',
  'Your New Category',
  // ... more categories
];
```

---

## 📞 Support

If you encounter any issues:

1. Check this guide thoroughly
2. Review error messages in browser console and terminal
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running
5. Check Google OAuth credentials

---

## 🎉 You're All Set!

Your Sahyog platform should now be running successfully. Start by:

1. Creating your profile
2. Adding your skills
3. Browsing community skills
4. Creating or responding to help requests

Happy skill-sharing! 🤝
