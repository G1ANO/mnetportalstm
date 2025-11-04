# MNet WiFi Portal - Subscription Management System

A comprehensive full-stack web application for managing WiFi subscriptions (Hotspot & Home Internet), user access, payments, loyalty rewards, and customer support. Built with modern technologies to provide seamless subscription management and enhanced user experience.

# Features

# User Features

Subscription Management
Loyalty & Rewards Program
Feedback & Support
Notifications System
User Dashboard

# Admin Features

Subscription Tier Management
User Management
Loyalty Program Administration
Feedback & Complaint Management
Communication Tools
Analytics & Insights


# Tech Stack
# Backend
- **Framework**: Flask 
- **Database**: PostgreSQL (Production Ready)
- **ORM**: SQLAlchemy
- **Authentication**: Flask-Bcrypt (Password Hashing)
- **Migrations**: Flask-Migrate (Alembic)
- **CORS**: Flask-CORS 4.0.1

# Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS3


# Project Structure

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
└── README.md                       # Project documentation
```

# Live Application

**Production URLs:**
- **Frontend**: https://mwalanet.vercel.app
- **Backend API**: https://mnetportalstm-101.onrender.com
- **Database**: PostgreSQL on Render

Default Admin Credentials:
- Email: `admin@mnet.com` OR Phone: `0737115102`
- Password: `admin123`


# Database Schema

# Users
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `phone_number`: Contact number
- `password_hash`: Bcrypt hashed password
- `role`: 'user' or 'admin'
- `status`: 'active' or 'inactive'
- `created_at`, `updated_at`: Timestamps

# Subscription Tiers
- `id`: Primary key
- `name`: Plan name (e.g., "Basic", "Premium")
- `price`: Plan price in KSH
- `duration_days`: Validity period
- `speed_limit`: Maximum speed (Mbps)
- `data_limit`: Data cap (GB)
- `description`: Plan details
- `tier_type`: 'hotspot' or 'home_internet'

# Subscriptions
- `id`: Primary key
- `user_id`: Foreign key to users
- `tier_id`: Foreign key to subscription_tiers
- `start_date`: Subscription start
- `end_date`: Subscription expiry
- `status`: 'active' or 'expired'

# Loyalty Points
- `id`: Primary key
- `user_id`: Foreign key to users
- `points_earned`: Total points earned
- `points_redeemed`: Total points used
- `balance`: Available points
- `last_updated`: Last modification timestamp

# Feedbacks
- `id`: Primary key
- `user_id`: Foreign key to users
- `type`: 'feedback' or 'complaint'
- `subscription_type`: 'hotspot' or 'home_internet'
- `subject`: Complaint subject (optional for feedback)
- `rating`: 1-5 stars (optional for complaints)
- `comment`: User's message
- `status`: 'pending' or 'resolved'
- `admin_response`: Admin's reply

# Notifications
- `id`: Primary key
- `user_id`: Foreign key to users
- `message`: Notification text
- `channel`: 'notification', 'email', 'sms', etc.
- `type`: 'promo', 'complaint_response', 'feedback_response'
- `status`: 'unread' or 'read'
- `created_at`: Timestamp

# User Roles

# Regular User
- Register and login
- View and purchase subscription plans
- Manage subscriptions (Hotspot & Home Internet)
- Earn and redeem loyalty points
- Submit feedback and complaints
- Receive and view notifications
- Track subscription history


# Administrator

- Access admin dashboard
- Create, edit, delete subscription tiers
- View all users and their data
- View all feedback and complaints
- Respond to user feedback/complaints
- Send mass communications
- View analytics and reports
- Monitor loyalty program


Potential features for future development:
- [ ] Payment gateway integration (M-Pesa, PayPal)
- [ ] Email notifications
- [ ] SMS and WhatsApp notifications
- [ ] Usage analytics dashboard
- [ ] Automated subscription renewal
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication (OTP)


# Team

Collaboratively developed by:

IAN MUTHIANI - LEAD DEV
DONALD KIARIE
SHANTELLE WAMBUI
LISA MUIRURI 
RODNEY KARANI


# Support & Contact

For issues, questions, or contributions:
- Contact the development team
- Call and Business WhatsApp: 0737115102
- Email: ianmuthiani101@gmail.com


# License

This project is proprietary software developed for MNet WiFi Portal. Contact authors for usage permissions. Unauthorized use or infringement would be subject to legal action.


# Built with Love for MNet Ltd

