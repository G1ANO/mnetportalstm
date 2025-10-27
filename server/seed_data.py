"""
Seed script to populate the database with sample data for testing
"""
from app import app, db
from models import User, SubscriptionTier, Subscription, Feedback, Complaint, LoyaltyPoint, Notification
from datetime import datetime, timedelta
import random

def clear_database():
    """Clear all existing data"""
    print("🗑️  Clearing existing data...")
    with app.app_context():
        db.session.query(Notification).delete()
        db.session.query(Feedback).delete()
        db.session.query(Complaint).delete()
        db.session.query(Subscription).delete()
        db.session.query(LoyaltyPoint).delete()
        db.session.query(SubscriptionTier).delete()
        db.session.query(User).delete()
        db.session.commit()
    print("✅ Database cleared!")

def create_users():
    """Create sample users"""
    print("\n👥 Creating users...")
    
    users_data = [
        # Admin user
        {
            'name': 'Admin User',
            'email': 'admin@mnet.com',
            'phone_number': '+254700000000',
            'password': 'admin123',
            'role': 'admin',
            'status': 'active'
        },
        # Regular users
        {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '+254712345678',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Jane Smith',
            'email': 'jane@example.com',
            'phone_number': '+254723456789',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Bob Johnson',
            'email': 'bob@example.com',
            'phone_number': '+254734567890',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Alice Williams',
            'email': 'alice@example.com',
            'phone_number': '+254745678901',
            'password': 'password123',
            'role': 'user',
            'status': 'inactive'
        },
        {
            'name': 'Charlie Brown',
            'email': 'charlie@example.com',
            'phone_number': '+254756789012',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Diana Prince',
            'email': 'diana@example.com',
            'phone_number': '+254767890123',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Eve Davis',
            'email': 'eve@example.com',
            'phone_number': '+254778901234',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        },
        {
            'name': 'Frank Miller',
            'email': 'frank@example.com',
            'phone_number': '+254789012345',
            'password': 'password123',
            'role': 'user',
            'status': 'inactive'
        },
        {
            'name': 'Grace Lee',
            'email': 'grace@example.com',
            'phone_number': '+254790123456',
            'password': 'password123',
            'role': 'user',
            'status': 'active'
        }
    ]
    
    users = []
    for user_data in users_data:
        user = User(
            name=user_data['name'],
            email=user_data['email'],
            phone_number=user_data['phone_number'],
            role=user_data['role'],
            status=user_data['status']
        )
        user.set_password(user_data['password'])
        db.session.add(user)
        users.append(user)
    
    db.session.commit()
    print(f"✅ Created {len(users)} users")
    return users

def create_tiers():
    """Create subscription tiers"""
    print("\n📊 Creating subscription tiers...")

    tiers_data = [
        # Hotspot Plans (hourly/daily)
        {
            'name': '1 Hour Plan',
            'price': 10,
            'duration_days': 1,  # Using as hours
            'speed_limit': 10,
            'data_limit': 500,
            'description': 'Perfect for quick browsing and social media'
        },
        {
            'name': '3 Hour Plan',
            'price': 20,
            'duration_days': 3,
            'speed_limit': 20,
            'data_limit': 1500,
            'description': 'Great for streaming and downloads'
        },
        {
            'name': '6 Hour Plan',
            'price': 30,
            'duration_days': 6,
            'speed_limit': 30,
            'data_limit': 3000,
            'description': 'Ideal for work and entertainment'
        },
        {
            'name': '12 Hour Plan',
            'price': 50,
            'duration_days': 12,
            'speed_limit': 50,
            'data_limit': 6000,
            'description': 'Best value for all-day connectivity'
        },
        {
            'name': '24 Hour Plan',
            'price': 80,
            'duration_days': 24,
            'speed_limit': 100,
            'data_limit': 12000,
            'description': 'Unlimited browsing for a full day'
        },
        {
            'name': 'Weekly Plan',
            'price': 300,
            'duration_days': 168,  # 7 days in hours
            'speed_limit': 100,
            'data_limit': 50000,
            'description': 'One week of high-speed internet'
        },
        # Home Internet Plans (monthly)
        {
            'name': 'Home Internet 10 Mbps',
            'price': 1000,
            'duration_days': 720,  # 30 days in hours
            'speed_limit': 10,
            'data_limit': 100000,
            'description': 'Reliable home internet for basic browsing and streaming'
        },
        {
            'name': 'Home Internet 20 Mbps',
            'price': 1500,
            'duration_days': 720,
            'speed_limit': 20,
            'data_limit': 200000,
            'description': 'Fast home internet for HD streaming and gaming'
        },
        {
            'name': 'Home Internet 30 Mbps',
            'price': 2000,
            'duration_days': 720,
            'speed_limit': 30,
            'data_limit': 300000,
            'description': 'Ultra-fast home internet for multiple devices and 4K streaming'
        }
    ]
    
    tiers = []
    for tier_data in tiers_data:
        tier = SubscriptionTier(**tier_data)
        db.session.add(tier)
        tiers.append(tier)
    
    db.session.commit()
    print(f"✅ Created {len(tiers)} subscription tiers")
    return tiers

def create_subscriptions(users, tiers):
    """Create sample subscriptions"""
    print("\n📋 Creating subscriptions...")
    
    subscriptions = []
    # Skip admin user (index 0), create subscriptions for regular users
    for i, user in enumerate(users[1:7], 1):  # First 6 regular users get subscriptions
        tier = random.choice(tiers[:5])  # Random tier from first 5
        
        # Create subscription with varying start times
        start_date = datetime.utcnow() - timedelta(hours=random.randint(1, 48))
        end_date = start_date + timedelta(hours=tier.duration_days)
        
        # Some subscriptions are expired, some are active
        status = 'active' if end_date > datetime.utcnow() else 'expired'
        
        subscription = Subscription(
            user_id=user.id,
            tier_id=tier.id,
            start_date=start_date,
            end_date=end_date,
            status=status
        )
        db.session.add(subscription)
        subscriptions.append(subscription)
    
    db.session.commit()
    print(f"✅ Created {len(subscriptions)} subscriptions")
    return subscriptions

def create_loyalty_points(users):
    """Create loyalty points for users"""
    print("\n🎁 Creating loyalty points...")
    
    loyalty_records = []
    # Skip admin user
    for user in users[1:]:
        points_earned = random.randint(10, 500)
        points_redeemed = random.randint(0, points_earned // 2)
        balance = points_earned - points_redeemed
        
        loyalty = LoyaltyPoint(
            user_id=user.id,
            points_earned=points_earned,
            points_redeemed=points_redeemed,
            balance=balance
        )
        db.session.add(loyalty)
        loyalty_records.append(loyalty)
    
    db.session.commit()
    print(f"✅ Created {len(loyalty_records)} loyalty records")
    return loyalty_records

def create_feedbacks(users, tiers):
    """Create sample feedback"""
    print("\n💬 Creating feedback...")
    
    comments = [
        "Great service! Very fast internet.",
        "Good value for money.",
        "Connection was stable throughout.",
        "Could be faster, but decent for the price.",
        "Excellent speed and reliability!",
        "Perfect for my needs.",
        "Sometimes disconnects but overall good.",
        "Best WiFi hotspot in the area!",
        "Fair pricing and good service.",
        "Very satisfied with the connection."
    ]
    
    feedbacks = []
    for user in users[1:8]:  # First 7 regular users
        for _ in range(random.randint(1, 3)):  # 1-3 feedbacks per user
            feedback = Feedback(
                user_id=user.id,
                tier_id=random.choice(tiers).id,
                rating=random.randint(3, 5),
                comment=random.choice(comments)
            )
            db.session.add(feedback)
            feedbacks.append(feedback)
    
    db.session.commit()
    print(f"✅ Created {len(feedbacks)} feedback entries")
    return feedbacks

def create_complaints(users):
    """Create sample complaints"""
    print("\n📢 Creating complaints...")
    
    complaints_data = [
        {
            'subject': 'Slow connection speed',
            'description': 'The internet speed is much slower than advertised.',
            'status': 'pending'
        },
        {
            'subject': 'Frequent disconnections',
            'description': 'I keep getting disconnected every few minutes.',
            'status': 'pending'
        },
        {
            'subject': 'Unable to connect',
            'description': 'Cannot connect to the WiFi network at all.',
            'status': 'resolved',
            'admin_response': 'Issue has been resolved. Please try connecting again.'
        },
        {
            'subject': 'Billing issue',
            'description': 'I was charged twice for the same subscription.',
            'status': 'resolved',
            'admin_response': 'Refund has been processed. You should see it in 3-5 business days.'
        },
        {
            'subject': 'Data limit reached too quickly',
            'description': 'My data limit was exhausted in just 2 hours.',
            'status': 'pending'
        }
    ]
    
    complaints = []
    for i, user in enumerate(users[1:6]):  # First 5 regular users
        complaint_data = complaints_data[i]
        complaint = Complaint(
            user_id=user.id,
            subject=complaint_data['subject'],
            description=complaint_data['description'],
            status=complaint_data['status'],
            admin_response=complaint_data.get('admin_response')
        )
        db.session.add(complaint)
        complaints.append(complaint)
    
    db.session.commit()
    print(f"✅ Created {len(complaints)} complaints")
    return complaints

def create_notifications(users):
    """Create sample notifications"""
    print("\n🔔 Creating notifications...")
    
    notifications = []
    for user in users[1:]:
        # Create 1-3 notifications per user
        for _ in range(random.randint(1, 3)):
            messages = [
                "Your subscription is about to expire in 24 hours.",
                "New promotional offer: Get 20% off on weekly plans!",
                "Your loyalty points have been updated.",
                "Welcome to Mnet Hotspot! Enjoy your connection.",
                "Maintenance scheduled for tonight 2AM-4AM."
            ]
            
            notification = Notification(
                user_id=user.id,
                message=random.choice(messages),
                channel=random.choice(['email', 'sms', 'both']),
                type=random.choice(['promo', 'alert', 'info']),
                status='sent'
            )
            db.session.add(notification)
            notifications.append(notification)
    
    db.session.commit()
    print(f"✅ Created {len(notifications)} notifications")
    return notifications

def main():
    """Main function to seed the database"""
    print("\n" + "="*50)
    print("🌱 SEEDING DATABASE WITH SAMPLE DATA")
    print("="*50)
    
    with app.app_context():
        # Clear existing data
        clear_database()
        
        # Create all sample data
        users = create_users()
        tiers = create_tiers()
        subscriptions = create_subscriptions(users, tiers)
        loyalty_records = create_loyalty_points(users)
        feedbacks = create_feedbacks(users, tiers)
        complaints = create_complaints(users)
        notifications = create_notifications(users)
        
        print("\n" + "="*50)
        print("✅ DATABASE SEEDING COMPLETED!")
        print("="*50)
        print("\n📊 Summary:")
        print(f"   • Users: {len(users)} (1 admin, {len(users)-1} regular users)")
        print(f"   • Subscription Tiers: {len(tiers)} (6 hotspot + 3 home internet)")
        print(f"   • Active Subscriptions: {len(subscriptions)}")
        print(f"   • Loyalty Records: {len(loyalty_records)}")
        print(f"   • Feedback Entries: {len(feedbacks)}")
        print(f"   • Complaints: {len(complaints)}")
        print(f"   • Notifications: {len(notifications)}")
        
        print("\n🔐 Test Credentials:")
        print("   Admin:")
        print("     Email: admin@mnet.com")
        print("     Password: admin123")
        print("\n   Regular Users:")
        print("     Email: john@example.com (or jane, bob, alice, etc.)")
        print("     Password: password123")
        print("\n🚀 You can now test the application with sample data!")
        print("="*50 + "\n")

if __name__ == '__main__':
    main()

