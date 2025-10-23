# seed_step1_core.py
from app import app, db
from models import User, SubscriptionTier
from datetime import datetime

with app.app_context():
    db.drop_all()
    db.create_all()

    # ---------- USERS ----------
    admin = User(
        name="Admin User",
        email="admin@example.com",
        phone_number="0700000000",
        role="admin",
        status="active"
    )
    admin.set_password("admin123")

    user1 = User(
        name="Jane Doe",
        email="jane@example.com",
        phone_number="0712345678",
        role="user",
        status="active"
    )
    user1.set_password("password123")

    user2 = User(
        name="John Smith",
        email="john@example.com",
        phone_number="0798765432",
        role="user",
        status="active"
    )
    user2.set_password("password123")

    # ---------- SUBSCRIPTION TIERS ----------
    weekly = SubscriptionTier(
        name="Weekly Plan",
        price=3.00,
        duration_days=7,
        speed_limit=10,
        data_limit=1024,
        description="Unlimited WiFi access for 7 days"
    )

    monthly = SubscriptionTier(
        name="Monthly Plan",
        price=10.00,
        duration_days=30,
        speed_limit=20,
        data_limit=4096,
        description="Access WiFi for 30 days"
    )

    premium = SubscriptionTier(
        name="Premium Plan",
        price=20.00,
        duration_days=60,
        speed_limit=50,
        data_limit=10240,
        description="High-speed WiFi for 2 months"
    )

    db.session.add_all([admin, user1, user2, weekly, monthly, premium])
    db.session.commit()

    
