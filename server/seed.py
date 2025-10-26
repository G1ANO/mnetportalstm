from app import app, db
from models import User, SubscriptionTier, Payment, Subscription, Feedback, Complaint, LoyaltyPoint, Redemption, Notification, UsagePattern, AdminActionLog
from datetime import datetime, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    
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

    payment1 = Payment(
        user=user1,
        amount=3.00,
        payment_method="mobile_money",
        transaction_reference="TXN1001",
        status="completed"
    )

    payment2 = Payment(
        user=user2,
        amount=10.00,
        payment_method="mobile_money",
        transaction_reference="TXN1002",
        status="completed"
    )

    db.session.add_all([payment1, payment2])
    db.session.commit()

    
    sub1 = Subscription(
        user=user1,
        tier=weekly,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=7),
        status="active",
        
    )

    sub2 = Subscription(
        user=user2,
        tier=monthly,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30),
        status="active",
        
    )

    db.session.add_all([sub1, sub2])
    db.session.commit()

    feedback1 = Feedback(
        user=user1,
        tier=weekly,
        rating=5,
        comment="Fast and reliable WiFi! Very satisfied."
    )

    feedback2 = Feedback(
        user=user2,
        tier=monthly,
        rating=4,
        comment="Good performance, but a bit slow during peak hours."
    )

    complaint1 = Complaint(
        user=user1,
        subject="Connection issue",
        description="WiFi disconnects every few minutes.",
        status="resolved",
        admin_response="We fixed the router near your location."
    )

    complaint2 = Complaint(
        user=user2,
        subject="Payment delay",
        description="My payment took too long to confirm.",
        status="pending"
    )

    db.session.add_all([feedback1, feedback2, complaint1, complaint2])
    db.session.commit()

    lp1 = LoyaltyPoint(user=user1, points_earned=50, points_redeemed=10, balance=40)
    lp2 = LoyaltyPoint(user=user2, points_earned=80, points_redeemed=20, balance=60)

    
    redeem1 = Redemption(
        user=user1,
        points_used=10,
        reward_type="Free WiFi Day",
        metadata="Redeemed for 1-day access"
    )

    db.session.add_all([
        lp1, lp2,
        redeem1
    ])
    db.session.commit()
  
    notif1 = Notification(
        user=user1,
        message="Your Weekly Plan will expire in 2 days.",
        channel="email",
        type="reminder",
        status="unread"
    )

    notif2 = Notification(
        user=user2,
        message="Get 10% off on next month’s plan!",
        channel="sms",
        type="promotion",
        status="sent"
    )

    
    usage1 = UsagePattern(
        user=user1,
        data_used_mb=350.5,
        session_duration=240,
        most_used_hours="6PM - 10PM",
        location="Nairobi"
    )

    usage2 = UsagePattern(
        user=user2,
        data_used_mb=800.0,
        session_duration=360,
        most_used_hours="8AM - 12PM",
        location="Mombasa"
    )

    
    log1 = AdminActionLog(
        admin_id=admin.id,
        action="Suspended user",
        target_user_id=user2.id,
        details="User violated fair usage policy."
    )

    db.session.add_all([notif1, notif2, usage1, usage2, log1])
    db.session.commit()
    print(" Database seeded successfully with sample data!")
    

