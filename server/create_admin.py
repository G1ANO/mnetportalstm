#!/usr/bin/env python3
from app import app, db
from models import User

with app.app_context():
    # Check if admin already exists
    admin = User.query.filter_by(email="admin@mnet.com").first()
    
    if admin:
        print("Admin user already exists!")
    else:
        # Create admin user
        admin = User(
            name="Admin",
            email="admin@mnet.com",
            phone_number="0700000000",
            role="admin",
            status="active"
        )
        admin.set_password("admin123")
        
        db.session.add(admin)
        db.session.commit()
        
        print("✅ Admin user created successfully!")
        print("Email: admin@mnet.com")
        print("Password: admin123")

