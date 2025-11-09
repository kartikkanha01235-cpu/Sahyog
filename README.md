# Sahyog - Community Skill-Sharing Platform

Sahyog is a community-driven platform designed to connect people for skill-sharing, mutual assistance, and peer-to-peer support.

## Features

- **Google Sign-In Integration**: Seamless authentication using Google accounts
- **User Profiles**: Comprehensive profiles with skills, bio, location, and reputation
- **Skill Management**: Add, edit, and manage skills across multiple categories
- **Help Requests**: Post and respond to help requests with urgency levels
- **Advanced Search**: Filter by skill, category, location, and rating
- **Reputation System**: Community-driven feedback and ratings

## Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Lucide React (icons)
- Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Passport.js (Google OAuth)
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

### 1. Clone and Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Get Google OAuth Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### 4. Run the Application

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## Project Structure

```
sahyog/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
├── .env                  # Environment variables
└── package.json          # Root package.json
```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/current` - Get current user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users by skills/location

### Skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `GET /api/skills/search` - Search skills

### Help Requests
- `POST /api/requests` - Create help request
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/respond` - Respond to request

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
