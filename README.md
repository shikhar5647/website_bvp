# Website BVP - Report Management System

A full-stack web application for managing and tracking reports across multiple branches and projects. Built with React, Node.js, Express, and MongoDB.

**GitHub Repository:** [shikhar5647/website_bvp](https://github.com/shikhar5647/website_bvp)

## 📋 Overview

Website BVP is a comprehensive report management system designed to track various types of programs and activities across multiple organizational branches. Users can submit data, generate consolidated reports, and analyze project-wise performance metrics.

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM

### Deployment
- **Vercel** - Frontend & Backend hosting

## 📁 Project Structure

```
website_bvp/
├── frontend/                      # React application
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── Navbar.js
│   │   ├── context/              # Context API
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── DataEntryPage.js
│   │   │   ├── AnalyticsPage.js
│   │   │   └── ReportsPage.js
│   │   ├── utils/                # Utility functions
│   │   │   └── api.js            # API calls
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   └── package.json
│
├── backend/                       # Express API server
│   ├── config/                   # Configuration files
│   │   └── branches.js           # Branch configuration
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # Mongoose models
│   │   ├── Report.js
│   │   └── User.js
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication routes
│   │   └── reports.js            # Report routes
│   ├── index.js                  # Server entry point
│   ├── vercel.json               # Vercel configuration
│   ├── package.json
│   └── .env                      # Environment variables
│
└── README.md                      # This file
```

## 🚀 Features

- **User Authentication** - Secure login with JWT tokens
- **Data Entry** - Submit reports for various programs and activities
- **Branch Management** - Support for multiple organizational branches
- **Consolidated Reports** - View aggregated data across branches
- **Project-wise Analytics** - Analyze performance by project type
- **Monthly Tracking** - Reports organized by financial year and month
- **CSV Export** - Download report data in CSV format
- **Print Support** - Print reports directly from the application

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Git

### Clone Repository
```bash
git clone https://github.com/shikhar5647/website_bvp.git
cd website_bvp
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd backend
npm install
```

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

## 💻 Running Locally

### Start Backend Server
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

### Start Frontend Application
```bash
cd frontend
npm start
```
Application will open at `http://localhost:3000`

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend uses Vercel deployment
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will auto-detect the project structure

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add required environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NODE_ENV`

4. **Deploy**
   - Vercel will automatically build and deploy on push to main branch
   - Frontend builds from the `frontend` directory
   - Backend is configured via `backend/vercel.json`

## 📝 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User authentication |
| Data Entry | `/data-entry` | Submit new reports |
| Analytics | `/analytics` | View branch-wise analytics |
| Reports | `/reports` | View and download reports |

## 🔐 Authentication

- Users log in with credentials
- JWT tokens are stored in localStorage
- Protected routes require valid authentication
- Users see branch-specific or consolidated views based on their role

## 📊 Report Types

Supported program categories:
- **Sanskar Gatividhi** - Educational programs
- **Sewa Gatividhi** - Service programs
- **Mahila Sahbhagita** - Women participation programs
- **Sampark Gatividhi** - Social engagement programs
- **Environment** - Environmental initiatives

## 🐛 Troubleshooting

### Import Path Issues
If you encounter "Module not found" errors during build:
- Ensure all imports use relative paths
- Files in `src/` use `./` for same-level imports
- Files in subdirectories use `../` to go up levels
- Example: Component in `components/` importing from `context/` should use `../context/AuthContext`

### Build Failures
- Clear build cache: Delete `node_modules` and `build/` folders
- Reinstall dependencies: Run `npm install`
- Check environment variables are properly set
- Verify MongoDB connection string

## 📧 Support

For issues or questions, please open an issue on [GitHub](https://github.com/shikhar5647/website_bvp/issues).

## 📄 License

This project is private and proprietary.

---

**Author:** [shikhar5647](https://github.com/shikhar5647)  
**Last Updated:** March 2026 
