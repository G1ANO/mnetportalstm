# 🌐 MNet WiFi Portal - Subscription Management System

A comprehensive full-stack web application for managing WiFi subscriptions (Hotspot & Home Internet), user access, payments, loyalty rewards, and customer support. Built with modern technologies to provide seamless subscription management and enhanced user experience.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### 👤 User Features

#### Subscription Management
- **Dual Subscription Types**: Hotspot and Home Internet plans
- **Browse & Subscribe**: View available subscription tiers with detailed pricing and features
- **Active Subscriptions**: Track current subscriptions with expiration dates
- **Subscription History**: View up to 3 expired plans for reference
- **Auto-Expiration**: Subscriptions automatically expire based on duration

#### Loyalty & Rewards Program
- **Earn Points**: Receive 10 points per shilling spent on subscriptions
- **Redeem Rewards**: Use loyalty points to get free subscriptions
- **Points Tracking**: View earned, redeemed, and available balance
- **Redemption History**: Track all reward redemptions

#### Feedback & Support
- **Submit Feedback**: Rate and review services (1-5 stars)
- **File Complaints**: Submit detailed complaints with subject and description
- **Track Status**: Monitor complaint resolution status (pending/resolved)
- **Admin Responses**: Receive and view admin responses to feedback/complaints
- **Separate Channels**: Different feedback systems for Hotspot and Home Internet

#### Notifications System
- **Real-time Notifications**: Receive in-app notifications for important updates
- **Notification Bell**: Visual indicator with unread count badge
- **Auto-refresh**: Notifications poll every 30 seconds
- **Notification Types**:
  - Mass communications from admin
  - Complaint responses
  - Feedback responses
  - Promotional messages
- **Mark as Read**: Click bell to mark all notifications as read

#### User Dashboard
- **Personalized Experience**: Separate dashboards for Hotspot and Home Internet
- **Quick Stats**: View loyalty points, active subscriptions, and notifications
- **Easy Navigation**: Tab-based interface for different features
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🔧 Admin Features

#### Subscription Tier Management
- **Create Plans**: Add new subscription tiers for Hotspot or Home Internet
- **Edit Plans**: Update pricing, duration, speed limits, and descriptions
- **Delete Plans**: Remove outdated subscription tiers
- **Dual Plan Types**: Manage both Hotspot and Home Internet plans separately

#### User Management
- **View All Users**: Access complete user database
- **User Analytics**: Track user subscriptions and activity
- **User Details**: View individual user information and subscription history
- **Status Monitoring**: Track active vs inactive users

#### Loyalty Program Administration
- **View All Records**: Access all user loyalty point balances
- **Track Earnings**: Monitor points earned by users
- **Track Redemptions**: View points redeemed and remaining balances
- **User-wise Breakdown**: See loyalty data for each user

#### Feedback & Complaint Management
- **Unified Dashboard**: View all feedback and complaints in one place
- **Filter by Type**: Separate views for Hotspot and Home Internet feedback
- **Respond to Users**: Reply directly to feedback and complaints
- **Status Management**: Mark complaints as pending or resolved
- **Legacy Support**: Handle old complaints from previous system

#### Communication Tools
- **Mass Communications**: Send messages to all users or specific groups
- **Targeted Messaging**: Send to all users, active users, or specific users
- **Multi-channel**: Support for in-app notifications, email, SMS, or all channels
- **Instant Delivery**: Messages delivered immediately with notification bell alerts

#### Analytics & Insights
- **Tier Subscriptions**: View subscription distribution across tiers
- **User Activity**: Monitor user engagement and subscription patterns
- **Loyalty Metrics**: Track loyalty program performance

### 🔔 Notification System Features

- **Smart Highlighting**: Bell icon highlights when new notifications arrive
- **Badge Counter**: Shows exact number of unread notifications
- **Auto-polling**: Checks for new notifications every 30 seconds
- **Admin Exclusion**: Admins don't receive mass communications
- **Instant Feedback**: Users notified immediately when admin responds
- **Visual Indicators**: Yellow bell icon and red badge for unread messages
- **One-click Read**: Mark all notifications as read with single click

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: SQLite (Development) / PostgreSQL (Production Ready)
- **ORM**: SQLAlchemy 3.1.1
- **Authentication**: Flask-Bcrypt (Password Hashing)
- **Migrations**: Flask-Migrate 4.0.7 (Alembic)
- **CORS**: Flask-CORS 4.0.1
- **API**: RESTful JSON API

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Icons**: Lucide React 0.548.0
- **Styling**: CSS3 with custom animations

### Development Tools
- **Version Control**: Git
- **Package Management**: pip (Python), npm (Node.js)
- **Database Migrations**: Alembic via Flask-Migrate

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                   React 19 + Vite 7                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ User Pages   │  │ Admin Pages  │  │  Components  │      │
│  │ - Dashboard  │  │ - Dashboard  │  │ - Feedback   │      │
│  │ - Hotspot    │  │ - Tiers Mgmt │  │ - Loyalty    │      │
│  │ - Home WiFi  │  │ - Users Mgmt │  │ - Notif Bell │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/JSON (Axios)
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Flask Backend API                          │
│                    (Port 5000)                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              RESTful API Endpoints                    │  │
│  │  /register  /login  /tiers  /subscriptions           │  │
│  │  /feedbacks  /complaints  /loyalty  /notifications   │  │
│  │  /communications  /analytics                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  - Authentication & Authorization                     │  │
│  │  - Subscription Management                            │  │
│  │  - Loyalty Points Calculation                         │  │
│  │  - Notification System                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SQLAlchemy ORM                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables: users, subscription_tiers, subscriptions,   │  │
│  │  feedbacks, complaints, loyalty_points, redemptions, │  │
│  │  notifications, payments, usage_patterns             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
mnetportalstm/
├── server/                          # Backend (Flask)
│   ├── app.py                      # Main application & API routes
│   ├── models.py                   # SQLAlchemy database models
│   ├── config.py                   # Configuration settings
│   ├── create_admin.py             # Admin user creation script
│   ├── requirements.txt            # Python dependencies
│   ├── Pipfile                     # Pipenv configuration
│   ├── migrations/                 # Database migration files
│   │   ├── versions/               # Migration versions
│   │   └── alembic.ini            # Alembic configuration
│   └── instance/                   # Instance-specific files
│       └── mnet_portal.db         # SQLite database
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── FeedbackForm.jsx   # Feedback submission
│   │   │   ├── ComplaintForm.jsx  # Complaint submission
│   │   │   ├── LoyaltyPanel.jsx   # Loyalty points display
│   │   │   ├── NotificationPanel.jsx # Notifications
│   │   │   ├── TierForm.jsx       # Tier management form
│   │   │   └── TierList.jsx       # Tier listing
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Loginpage.jsx      # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── Dashboard.jsx      # Hotspot dashboard
│   │   │   ├── UserDashboard.jsx  # Home Internet dashboard
│   │   │   └── AdminDashboard.jsx # Admin panel
│   │   ├── styles/                 # CSS files
│   │   │   └── App.css            # Global styles
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Base styles
│   ├── public/                     # Static assets
│   ├── package.json               # Node dependencies
│   ├── vite.config.js             # Vite configuration
│   └── index.html                 # HTML template
│
├── start-backend.sh                # Backend startup script
├── start-frontend.sh               # Frontend startup script
└── README.md                       # This file
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Python**: 3.8+ (3.12.3 recommended)
- **Node.js**: 20.19+ or 22.12+ (required for Vite 7)
- **npm**: 9.0+
- **Git**: For version control

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mnetportalstm
```

### Step 2: Backend Setup

#### Option A: Using Startup Script (Recommended)

```bash
chmod +x start-backend.sh
./start-backend.sh
```

The script will:
- Navigate to the server directory
- Install Python dependencies
- Install flask-bcrypt
- Start the Flask development server

#### Option B: Manual Setup

```bash
cd server

# Install dependencies
pip3 install -r requirements.txt
pip3 install flask-bcrypt

# Create database tables
python3 app.py
```

The backend will run on: **http://127.0.0.1:5000**

### Step 3: Frontend Setup

Open a **new terminal** window:

#### Option A: Using Startup Script (Recommended)

```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

The script will:
- Navigate to the client directory
- Install npm dependencies
- Start the Vite development server

#### Option B: Manual Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on: **http://localhost:5173**

### Step 4: Create Admin User

In a **new terminal** window:

```bash
cd server
python3 create_admin.py
```

**Default Admin Credentials:**
- Email: `admin@mnet.com`
- Password: `admin123`

⚠️ **Important**: Change the admin password after first login in production!

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:5000

---

## ⚙️ Configuration

### Backend Configuration (`server/config.py`)

```python
class Config:
    SECRET_KEY = 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/mnet_portal.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### Frontend Configuration

Update API base URL in components if deploying to production:
```javascript
const API_URL = 'http://localhost:5000'; // Change for production
```

---

## � Usage

### For Users

1. **Register**: Create a new account at `/register`
2. **Login**: Access your account at `/login`
3. **Browse Plans**: View available Hotspot and Home Internet plans
4. **Subscribe**: Purchase a subscription plan
5. **Earn Points**: Automatically earn 10 points per shilling spent
6. **Redeem Rewards**: Use points to get free subscriptions
7. **Submit Feedback**: Rate and review services
8. **File Complaints**: Report issues and track resolution
9. **View Notifications**: Check the notification bell for updates

### For Admins

1. **Login**: Use admin credentials at `/login`
2. **Manage Tiers**: Create, edit, or delete subscription plans
3. **View Users**: Monitor all registered users
4. **Respond to Feedback**: Reply to user feedback and complaints
5. **Send Communications**: Broadcast messages to users
6. **Monitor Loyalty**: Track loyalty program metrics
7. **View Analytics**: Access subscription and user analytics

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "0712345678",
  "password": "securepassword"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Subscription Endpoints

#### Get Tiers
```http
GET /tiers?type=hotspot
GET /tiers?type=home_internet
```

#### Create Subscription
```http
POST /subscriptions
Content-Type: application/json

{
  "user_id": 1,
  "tier_id": 2
}
```

#### Get User Subscriptions
```http
GET /subscriptions?user_id=1&type=hotspot
```

### Loyalty Endpoints

#### Get Loyalty Points
```http
GET /loyalty?user_id=1
```

#### Redeem Points
```http
POST /loyalty/redeem
Content-Type: application/json

{
  "user_id": 1,
  "tier_id": 2
}
```

### Feedback & Complaints

#### Submit Feedback
```http
POST /feedbacks
Content-Type: application/json

{
  "user_id": 1,
  "type": "feedback",
  "subscription_type": "hotspot",
  "rating": 5,
  "comment": "Great service!"
}
```

#### Submit Complaint
```http
POST /feedbacks
Content-Type: application/json

{
  "user_id": 1,
  "type": "complaint",
  "subscription_type": "hotspot",
  "subject": "Connection Issue",
  "comment": "Frequent disconnections"
}
```

### Notifications

#### Get Notifications
```http
GET /notifications?user_id=1
```

#### Mark All as Read
```http
PATCH /notifications/mark-all-read?user_id=1
```

### Admin Endpoints

#### Send Communication
```http
POST /communications/send
Content-Type: application/json

{
  "admin_id": 1,
  "message": "System maintenance tonight",
  "channel": "notification",
  "recipients": "all"
}
```

#### Reply to Feedback
```http
PATCH /feedbacks/{feedback_id}/reply
Content-Type: application/json

{
  "admin_id": 1,
  "admin_response": "Thank you for your feedback!",
  "status": "resolved"
}
```

---

## 🗄️ Database Schema

### Core Tables

#### Users
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `phone_number`: Contact number
- `password_hash`: Bcrypt hashed password
- `role`: 'user' or 'admin'
- `status`: 'active' or 'inactive'
- `created_at`, `updated_at`: Timestamps

#### Subscription Tiers
- `id`: Primary key
- `name`: Plan name (e.g., "Basic", "Premium")
- `price`: Plan price in KSH
- `duration_days`: Validity period
- `speed_limit`: Maximum speed (Mbps)
- `data_limit`: Data cap (GB)
- `description`: Plan details
- `tier_type`: 'hotspot' or 'home_internet'

#### Subscriptions
- `id`: Primary key
- `user_id`: Foreign key to users
- `tier_id`: Foreign key to subscription_tiers
- `start_date`: Subscription start
- `end_date`: Subscription expiry
- `status`: 'active' or 'expired'

#### Loyalty Points
- `id`: Primary key
- `user_id`: Foreign key to users
- `points_earned`: Total points earned
- `points_redeemed`: Total points used
- `balance`: Available points
- `last_updated`: Last modification timestamp

#### Feedbacks
- `id`: Primary key
- `user_id`: Foreign key to users
- `type`: 'feedback' or 'complaint'
- `subscription_type`: 'hotspot' or 'home_internet'
- `subject`: Complaint subject (optional for feedback)
- `rating`: 1-5 stars (optional for complaints)
- `comment`: User's message
- `status`: 'pending' or 'resolved'
- `admin_response`: Admin's reply

#### Notifications
- `id`: Primary key
- `user_id`: Foreign key to users
- `message`: Notification text
- `channel`: 'notification', 'email', 'sms', etc.
- `type`: 'promo', 'complaint_response', 'feedback_response'
- `status`: 'unread' or 'read'
- `created_at`: Timestamp

---

## 👥 User Roles

### Regular User
**Capabilities:**
- Register and login
- View and purchase subscription plans
- Manage subscriptions (Hotspot & Home Internet)
- Earn and redeem loyalty points
- Submit feedback and complaints
- Receive and view notifications
- Track subscription history

**Restrictions:**
- Cannot access admin dashboard
- Cannot manage other users
- Cannot create/edit subscription tiers
- Cannot send mass communications

### Administrator
**Capabilities:**
- All user capabilities
- Access admin dashboard
- Create, edit, delete subscription tiers
- View all users and their data
- View all feedback and complaints
- Respond to user feedback/complaints
- Send mass communications
- View analytics and reports
- Monitor loyalty program

**Restrictions:**
- Cannot delete users (data integrity)
- Should not receive mass communications

---

## 🎨 Key Features Explained

### Loyalty Points System
- **Earning**: Users earn 10 points per KSH spent
  - Example: 50 KSH plan = 500 points
- **Redemption**: Points can be used to get free subscriptions
  - Each tier has a points requirement
  - Points are deducted upon redemption
- **Tracking**: Full history of earned and redeemed points

### Notification System
- **Auto-polling**: Checks for new notifications every 30 seconds
- **Visual Indicators**:
  - Yellow bell icon when unread notifications exist
  - Red badge showing unread count
  - Bell ring animation
- **Triggers**:
  - Admin sends mass communication
  - Admin responds to complaint
  - Admin responds to feedback
- **Smart Filtering**: Admins excluded from mass communications

### Subscription Management
- **Dual Types**: Separate systems for Hotspot and Home Internet
- **Auto-expiration**: Subscriptions expire based on duration_days
- **History Tracking**: Users can view up to 3 expired plans
- **Status Management**: Active vs expired subscriptions

### Feedback & Complaints
- **Unified System**: Single table handles both feedback and complaints
- **Type-specific Fields**:
  - Feedback: Requires rating (1-5 stars)
  - Complaints: Requires subject
- **Admin Responses**: Admins can reply and mark as resolved
- **Notification Integration**: Users notified when admin responds

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Version Error
**Error**: `The engine "node" is incompatible with this module`

**Solution**: Upgrade to Node.js 20+
```bash
# Using nvm
nvm install 20
nvm use 20

# Verify version
node --version
```

#### 2. Python Dependencies Error
**Error**: `ModuleNotFoundError: No module named 'flask_bcrypt'`

**Solution**: Install flask-bcrypt
```bash
cd server
pip3 install flask-bcrypt
```

#### 3. CORS Errors
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: CORS is already enabled in `server/app.py`. Ensure:
- Backend is running on port 5000
- Frontend is accessing `http://localhost:5000`
- Flask-CORS is installed

#### 4. Database Not Found
**Error**: `OperationalError: no such table: users`

**Solution**: Create database tables
```bash
cd server
python3 app.py
# Tables are auto-created on first run
```

#### 5. Port Already in Use
**Error**: `Address already in use: Port 5000`

**Solution**: Kill the process using the port
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### 6. Frontend Build Errors
**Error**: Various npm errors

**Solution**: Clear cache and reinstall
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**
   - Set `SECRET_KEY` to a strong random value
   - Configure production database URI
   - Set `DEBUG=False` in Flask

2. **Database**
   - Migrate from SQLite to PostgreSQL for production
   - Set up regular backups
   - Configure connection pooling

3. **Security**
   - Change default admin password
   - Enable HTTPS
   - Implement rate limiting
   - Add input validation and sanitization
   - Set up CSRF protection

4. **Frontend**
   - Build for production: `npm run build`
   - Update API URLs to production backend
   - Enable compression
   - Configure CDN for static assets

5. **Backend**
   - Use production WSGI server (Gunicorn, uWSGI)
   - Set up reverse proxy (Nginx)
   - Configure logging
   - Enable monitoring

### Quick Production Build

```bash
# Frontend
cd client
npm run build
# Output in client/dist/

# Backend
cd server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 📊 Analytics & Reporting

The system tracks:
- Subscription tier distribution
- User activity patterns
- Loyalty program metrics
- Feedback and complaint trends
- Revenue analytics (via subscription purchases)

Access analytics through the Admin Dashboard.

---

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt
- **Role-based Access Control**: User vs Admin permissions
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Session Management**: Secure session handling

---

## 🧪 Testing

### Manual Testing Checklist

**User Flow:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Browse subscription tiers
- [ ] Purchase subscription
- [ ] Verify loyalty points awarded
- [ ] Submit feedback
- [ ] File complaint
- [ ] View notifications
- [ ] Redeem loyalty points

**Admin Flow:**
- [ ] Login as admin
- [ ] Create new subscription tier
- [ ] Edit existing tier
- [ ] View all users
- [ ] Respond to feedback
- [ ] Respond to complaint
- [ ] Send mass communication
- [ ] Verify user receives notification

---

## 📝 Future Enhancements

Potential features for future development:
- [ ] Payment gateway integration (M-Pesa, PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Usage analytics dashboard
- [ ] Automated subscription renewal
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and exports
- [ ] User profile management
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Webhook support for integrations

---

## 👥 Team

Collaboratively developed by: **Rodney, Donn, Lee, Shantelle, Lissa**, and contributors.

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Business WhatsApp: **0737115102**

---

## 📄 License

This project is proprietary software developed for MNet WiFi Portal.

---

## 🙏 Acknowledgments

- Flask and React communities for excellent documentation
- SQLAlchemy for robust ORM
- Vite for blazing-fast development experience
- All contributors and testers

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

<div align="center">

**Built with ❤️ for MNet WiFi Portal**

**Happy Coding! 🚀**

</div>

