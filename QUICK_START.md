# 🚀 Sahyog - Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Dependencies (2 min)

```bash
npm install
cd client && npm install && cd ..
```

## Step 2: Setup Environment (1 min)

1. Copy `.env.example` to `.env`
2. Update these critical values:

```env
MONGODB_URI=mongodb://localhost:27017/sahyog
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
JWT_SECRET=any_random_long_string
SESSION_SECRET=another_random_string
```

## Step 3: Get Google OAuth Credentials (2 min)

1. Go to: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth credentials
4. Add redirect URI: `http://localhost:5000/auth/google/callback`
5. Copy Client ID & Secret to `.env`

## Step 4: Start MongoDB

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

## Step 5: Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## ✅ That's it!

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions.
