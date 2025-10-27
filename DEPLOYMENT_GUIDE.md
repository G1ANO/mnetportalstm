# WiFi Portal - Deployment Guide

## 📋 Project Overview

**WiFi Portal** is a full-stack web application for managing WiFi subscriptions, user access, and payments.

### Tech Stack
- **Backend**: Flask (Python)
- **Frontend**: React + Vite
- **Database**: SQLite
- **Authentication**: bcrypt

---

## 🏗️ Architecture

```
mnetportalstm/
├── server/              # Flask Backend API
│   ├── app.py          # Main Flask application
│   ├── models.py       # Database models
│   ├── config.py       # Configuration
│   ├── seed.py         # Database seeding
│   └── requirements.txt
│
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── styles/     # CSS files
│   └── package.json
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Python**: 3.8+ (3.12.3 recommended)
- **Node.js**: 20.19+ or 22.12+ (for Vite 7)
- **npm**: 9.0+
- **pip**: Latest version

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install Python dependencies**:
   ```bash
   pip3 install -r requirements.txt
   pip3 install flask-bcrypt  # Additional dependency
   ```

3. **Initialize database** (automatic on first run):
   ```bash
   python3 app.py
   ```

4. **Seed database** (optional):
   ```bash
   python3 seed.py
   ```

5. **Run Flask server**:
   ```bash
   python3 app.py
   ```
   
   Server runs on: **http://127.0.0.1:5000**

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   **Note**: Requires Node.js 20.19+ or 22.12+ for Vite 7

   If you have Node.js 18.x, you need to either:
   - Upgrade Node.js to version 20+
   - Or downgrade Vite in package.json

### Upgrading Node.js (if needed)

Using nvm (Node Version Manager):
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20
nvm use 20

# Verify
node --version  # Should show v20.x.x
```

---

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login

### Subscription Tiers
- `GET /tiers` - Get all subscription tiers
- `POST /tiers` - Create tier (admin only)
- `PATCH /tiers/<id>` - Update tier (admin only)
- `DELETE /tiers/<id>` - Delete tier (admin only)

### Feedback
- `GET /feedbacks` - Get all feedback
- `POST /feedbacks` - Submit feedback

### Complaints
- `GET /complaints` - Get complaints (filtered by role)
- `POST /complaints` - Submit complaint
- `PATCH /complaints/<id>/reply` - Admin reply to complaint

### Loyalty & Notifications
- `GET /loyalty?user_id=<id>` - Get user loyalty points
- `GET /notifications?user_id=<id>` - Get user notifications

---

## 🗄️ Database Models

### User
- id, name, email, phone_number, password_hash, role, status
- Relationships: subscriptions, payments, feedbacks, complaints, loyalty_points

### SubscriptionTier
- id, name, price, duration_days, speed_limit, data_limit, description

### Feedback
- id, user_id, tier_id, rating, comment

### Complaint
- id, user_id, subject, description, status, admin_response

### LoyaltyPoint
- id, user_id, points_earned, points_redeemed, balance

### Notification
- id, user_id, message, channel, type, status

---

## 🎨 Frontend Components

### Pages
- **Home.jsx** - Landing page
- **Loginpage.jsx** - User login
- **Register.jsx** - User registration
- **Dashboard.jsx** - General dashboard
- **UserDashboard.jsx** - User-specific dashboard
- **AdminDashboard.jsx** - Admin panel

### Components
- **TierForm.jsx** - Create/edit subscription tiers
- **TierList.jsx** - Display subscription tiers
- **LoyaltyPanel.jsx** - Show loyalty points
- **NotificationPanel.jsx** - Display notifications
- **feedback.jsx** - Feedback form
- **navbar.jsx** - Navigation bar

---

## 🔧 Configuration

### Backend (server/config.py)
```python
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///wifi_portal.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'super-secret-key'  # Change in production!
```

### Frontend (client/vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // Proxy API requests
    }
  }
})
```

---

## 🚢 Production Deployment

### Backend Deployment

1. **Use a production WSGI server** (Gunicorn):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Environment variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=<your-secret-key>
   export DATABASE_URL=<your-database-url>
   ```

3. **Database**: Consider PostgreSQL for production instead of SQLite

### Frontend Deployment

1. **Build for production**:
   ```bash
   cd client
   npm run build
   ```

2. **Serve static files**: Deploy `dist/` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Nginx

---

## 🧪 Testing

### Backend Testing
```bash
cd server
python3 -m pytest  # If tests are available
```

### Frontend Testing
```bash
cd client
npm run test  # If tests are configured
```

---

## 📝 Current Status

✅ **Backend**: Running successfully on http://127.0.0.1:5000
✅ **Database**: SQLite initialized automatically
✅ **API**: All endpoints functional
⚠️ **Frontend**: Requires Node.js 20+ to run Vite 7

---

## 🐛 Troubleshooting

### Issue: "crypto.hash is not a function"
**Solution**: Upgrade Node.js to version 20.19+ or 22.12+

### Issue: "Module not found: flask_bcrypt"
**Solution**: `pip3 install flask-bcrypt`

### Issue: Database not created
**Solution**: Run `python3 app.py` - it creates the database automatically

### Issue: CORS errors
**Solution**: Flask-CORS is installed but not configured in app.py. Add:
```python
from flask_cors import CORS
CORS(app)
```

---

## 👥 Team Collaboration

All team members should:
1. Pull latest changes: `git pull origin dev`
2. Install dependencies (both backend and frontend)
3. Run both servers concurrently for development

---

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

