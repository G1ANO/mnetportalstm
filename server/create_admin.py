#!/usr/bin/env python3
from app import app, db
from models import User

with app.app_context():
    # Create all tables first
    db.create_all()

    # Check if admin already exists
    admin = User.query.filter_by(email="admin@mnet.com").first()

    if admin:
        print(f"Admin user already exists! ID: {admin.id}, Role: {admin.role}")
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

        print(f"✅ Admin user created successfully!")
        print(f"ID: {admin.id}")
        print(f"Email: admin@mnet.com")
        print(f"Password: admin123")
        print(f"Role: {admin.role}")

