
from app import app, db
from models import User, SubscriptionTier
from datetime import datetime

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

    
from app import app, db
from models import User, SubscriptionTier, Payment, Subscription
from datetime import datetime, timedelta

with app.app_context():
    user1 = User.query.filter_by(email="jane@example.com").first()
    user2 = User.query.filter_by(email="john@example.com").first()
    weekly = SubscriptionTier.query.filter_by(name="Weekly Plan").first()
    monthly = SubscriptionTier.query.filter_by(name="Monthly Plan").first()

    
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
        payment_id=payment1.id,
        auto_renew=True
    )

    sub2 = Subscription(
        user=user2,
        tier=monthly,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30),
        status="active",
        payment_id=payment2.id,
        auto_renew=False
    )

    db.session.add_all([sub1, sub2])
    db.session.commit()

    
