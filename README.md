# WiFi Portal - Subscription Management System

A full-stack web application for managing WiFi subscriptions, user access, payments, and customer support.

## 🌟 Features

### User Features
- ✅ User registration and authentication
- ✅ Browse subscription tiers
- ✅ Submit feedback and ratings
- ✅ File complaints and track status
- ✅ View loyalty points
- ✅ Receive notifications

### Admin Features
- ✅ Manage subscription tiers (Create, Update, Delete)
- ✅ View all user feedback
- ✅ Respond to user complaints
- ✅ Monitor user activity

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: SQLAlchemy
- **Authentication**: bcrypt
- **Migrations**: Flask-Migrate (Alembic)
- **API**: RESTful JSON API

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Styling**: CSS3

## 📁 Project Structure

```
mnetportalstm/
├── server/                     # Backend (Flask)
│   ├── app.py                 # Main application & routes
│   ├── models.py              # Database models
│   ├── config.py              # Configuration
│   ├── seed.py                # Database seeding
│   ├── requirements.txt       # Python dependencies
│   └── migrations/            # Database migrations
│
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── DEPLOYMENT_GUIDE.md        # Detailed deployment instructions
├── start-backend.sh           # Backend startup script
└── start-frontend.sh          # Frontend startup script
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (3.12.3 recommended)
- Node.js 20.19+ or 22.12+ (for Vite 7)
- npm 9.0+

### Option 1: Using Startup Scripts (Recommended)

#### Start Backend
```bash
./start-backend.sh
```

#### Start Frontend (in a new terminal)
```bash
./start-frontend.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd server
pip3 install -r requirements.txt
pip3 install flask-bcrypt
python3 app.py
```
Backend runs on: **http://127.0.0.1:5000**

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173** (default Vite port)

## 📡 API Endpoints

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete API documentation.

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🐛 Troubleshooting

### Node.js Version Error
**Solution**: Upgrade to Node.js 20+
```bash
nvm install 20 && nvm use 20
```

### CORS Errors
**Solution**: CORS is enabled in `server/app.py`

## 👥 Team

Collaboratively developed by: Rodney, Donn, Lee, Shantelle, Lissa, and contributors.

## 📞 Support

For issues, create an issue in the repository or contact the development team.

---

**Happy Coding! 🚀**
