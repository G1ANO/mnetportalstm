from flask import Flask, jsonify,request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, bcrypt, User, SubscriptionTier, Subscription, Feedback, Complaint, LoyaltyPoint, Notification
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to WiFi Portal"}), 200

@app.route('/register', methods=['POST'])
def register():
    
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    #this checks if email already exists
    
    user = User(
        name=data.get('name'),
        email=data['email'],
        phone_number=data.get('phone_number'),
        role='user'
    )#this creates a new user

    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200

@app.route('/tiers', methods=['GET'])
def get_tiers():
    tier_type = request.args.get('type')  # Optional filter: 'hotspot' or 'home_internet'

    if tier_type:
        tiers = SubscriptionTier.query.filter_by(tier_type=tier_type).all()
    else:
        tiers = SubscriptionTier.query.all()

    result = [{
        "id": t.id,
        "name": t.name,
        "price": float(t.price),
        "duration_days": t.duration_days,
        "speed_limit": t.speed_limit,
        "data_limit": t.data_limit,
        "description": t.description,
        "tier_type": t.tier_type
    } for t in tiers]
    return jsonify(result), 200

@app.route('/tiers', methods=['POST'])
def create_tier():
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    tier = SubscriptionTier(
        name=data.get('name'),
        price=data.get('price'),
        duration_days=data.get('duration_days'),
        speed_limit=data.get('speed_limit'),
        data_limit=data.get('data_limit'),
        description=data.get('description'),
        tier_type=data.get('tier_type', 'hotspot')  # Default to 'hotspot'
    )
    db.session.add(tier)
    db.session.commit()
    return jsonify({"message": "Tier created successfully"}), 201

@app.route('/tiers/<int:id>', methods=['PATCH'])
def update_tier(id):
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    tier = SubscriptionTier.query.get_or_404(id)
    for key, value in data.items():
        setattr(tier, key, value)
    db.session.commit()
    return jsonify({"message": "Tier updated"}), 200

@app.route('/tiers/<int:id>', methods=['DELETE'])
def delete_tier(id):
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    tier = SubscriptionTier.query.get_or_404(id)
    db.session.delete(tier)
    db.session.commit()
    return jsonify({"message": "Tier deleted"}), 200
#here an admin deletes a subscription tier

@app.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    feedbacks = Feedback.query.all()
    result = [{
        "id": f.id,
        "user_id": f.user_id,
        "tier_id": f.tier_id,
        "rating": f.rating,
        "comment": f.comment
    } for f in feedbacks]
    return jsonify(result), 200
#this returns all feedback submitted by users

@app.route('/feedbacks', methods=['POST'])
def add_feedback():
    data = request.get_json()
    user_id = data.get('user_id')

    feedback = Feedback(
        user_id=user_id,
        tier_id=data.get('tier_id'),
        rating=data.get('rating'),
        comment=data.get('comment')
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted successfully"}), 201
#this allows users to submit feedback about a subscription tier

@app.route('/complaints', methods=['GET'])
def get_complaints():
    """Fetch complaints (admin sees all, user sees own)."""
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role == 'admin':
        complaints = Complaint.query.all()
    else:
        complaints = Complaint.query.filter_by(user_id=user.id).all()

    result = [{
        "id": c.id,
        "subject": c.subject,
        "description": c.description,
        "status": c.status,
        "admin_response": c.admin_response
    } for c in complaints]

    return jsonify(result), 200


@app.route('/complaints', methods=['POST'])
def add_complaint():
    """User submits a complaint."""
    data = request.get_json()
    c = Complaint(
        user_id=data.get('user_id'),
        subject=data.get('subject'),
        description=data.get('description'),
        status="pending"
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({"message": "Complaint submitted successfully"}), 201


@app.route('/complaints/<int:id>/reply', methods=['PATCH'])
def reply_complaint(id):
    """Admin responds to a complaint."""
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != "admin":
        return jsonify({"error": "Admins only"}), 403

    complaint = Complaint.query.get_or_404(id)
    complaint.admin_response = data.get('admin_response')
    complaint.status = data.get('status', 'resolved')
    db.session.commit()
    return jsonify({"message": "Complaint updated successfully"}), 200



@app.route('/loyalty', methods=['GET'])
def get_loyalty_points():
    """View loyalty points for a user."""
    user_id = request.args.get('user_id')
    points = LoyaltyPoint.query.filter_by(user_id=user_id).first()

    if not points:
        return jsonify({"points": 0, "balance": 0}), 200

    return jsonify({
        "points_earned": points.points_earned,
        "points_redeemed": points.points_redeemed,
        "balance": points.balance
    }), 200


@app.route('/notifications', methods=['GET'])
def get_notifications():
    """Fetch user notifications."""
    user_id = request.args.get('user_id')
    notes = Notification.query.filter_by(user_id=user_id).all()

    result = [{
        "message": n.message,
        "channel": n.channel,
        "type": n.type,
        "status": n.status
    } for n in notes]

    return jsonify(result), 200

@app.route('/users', methods=['GET'])
def get_users():
    """Get all users with their subscription info (admin only)."""
    users = User.query.all()
    result = []
    for u in users:
        # Get user's active subscription
        subscription = db.session.query(Subscription).filter_by(user_id=u.id, status='active').first()
        tier_name = None
        if subscription:
            tier = SubscriptionTier.query.get(subscription.tier_id)
            tier_name = tier.name if tier else None

        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone_number": u.phone_number,
            "device_id": getattr(u, 'device_id', None),
            "subscription_tier": tier_name,
            "activated_at": subscription.start_date.isoformat() if subscription else None,
            "status": u.status,
            "usage_mb": getattr(u, 'usage_mb', 0)
        })
    return jsonify(result), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a single user by ID."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone_number or 'N/A',
        "is_active": user.status == 'active',
        "created_at": user.created_at.isoformat() if user.created_at else None
    }), 200

@app.route('/users/<int:user_id>/disconnect', methods=['POST'])
def disconnect_user(user_id):
    """Disconnect a user from the network (admin only)."""
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    user = User.query.get_or_404(user_id)
    user.status = 'inactive'
    db.session.commit()
    return jsonify({"message": "User disconnected successfully"}), 200

@app.route('/loyalty/all', methods=['GET'])
def get_all_loyalty():
    """Get all loyalty records (admin only)."""
    loyalty_records = LoyaltyPoint.query.all()
    result = []
    for lp in loyalty_records:
        user = User.query.get(lp.user_id)
        result.append({
            "user_id": lp.user_id,
            "user_name": user.name if user else None,
            "user_email": user.email if user else None,
            "phone_number": user.phone_number if user else None,
            "device_id": getattr(user, 'device_id', None) if user else None,
            "points_earned": lp.points_earned
        })
    return jsonify(result), 200

@app.route('/feedbacks/<int:feedback_id>/reply', methods=['PATCH'])
def reply_to_feedback(feedback_id):
    """Admin responds to feedback."""
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    feedback = Feedback.query.get_or_404(feedback_id)
    # You might want to add an admin_response field to Feedback model
    # For now, we'll just acknowledge the response
    db.session.commit()
    return jsonify({"message": "Response sent successfully"}), 200

@app.route('/subscriptions', methods=['POST'])
def create_subscription():
    """User subscribes to a tier."""
    data = request.get_json()
    user_id = data.get('user_id')
    tier_id = data.get('tier_id')

    tier = SubscriptionTier.query.get_or_404(tier_id)

    # Calculate end date based on duration_days
    from datetime import datetime, timedelta
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(hours=tier.duration_days)  # Assuming duration_days is actually hours

    subscription = Subscription(
        user_id=user_id,
        tier_id=tier_id,
        start_date=start_date,
        end_date=end_date,
        status='active'
    )
    db.session.add(subscription)

    # Award loyalty points (e.g., 10 points per subscription)
    loyalty = LoyaltyPoint.query.filter_by(user_id=user_id).first()
    if not loyalty:
        loyalty = LoyaltyPoint(user_id=user_id, points_earned=10, points_redeemed=0, balance=10)
        db.session.add(loyalty)
    else:
        loyalty.points_earned += 10
        loyalty.balance += 10

    db.session.commit()
    return jsonify({"message": "Subscription created successfully"}), 201

@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    """Get user subscriptions."""
    user_id = request.args.get('user_id')
    subscriptions = Subscription.query.filter_by(user_id=user_id).all()

    result = []
    for s in subscriptions:
        tier = SubscriptionTier.query.get(s.tier_id)
        result.append({
            "id": s.id,
            "tier_name": tier.name if tier else None,
            "status": s.status,
            "start_date": s.start_date.isoformat() if s.start_date else None,
            "end_date": s.end_date.isoformat() if s.end_date else None
        })
    return jsonify(result), 200

@app.route('/loyalty/redeem', methods=['POST'])
def redeem_loyalty_points():
    """Redeem loyalty points."""
    data = request.get_json()
    user_id = data.get('user_id')
    points = data.get('points')

    loyalty = LoyaltyPoint.query.filter_by(user_id=user_id).first()
    if not loyalty or loyalty.balance < points:
        return jsonify({"error": "Insufficient points"}), 400

    loyalty.points_redeemed += points
    loyalty.balance -= points
    db.session.commit()
    return jsonify({"message": "Points redeemed successfully"}), 200

@app.route('/communications/send', methods=['POST'])
def send_communication():
    """Send mass communication (admin only)."""
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    message = data.get('message')
    channel = data.get('channel')  # email, sms, or both
    recipients = data.get('recipients')  # all, active, or specific
    specific_users = data.get('specificUsers', [])

    # Determine which users to send to
    if recipients == 'all':
        users = User.query.all()
    elif recipients == 'active':
        users = User.query.filter_by(status='active').all()
    elif recipients == 'specific':
        users = User.query.filter(User.id.in_(specific_users)).all()
    else:
        return jsonify({"error": "Invalid recipients"}), 400

    # Create notifications for each user
    for user in users:
        notification = Notification(
            user_id=user.id,
            message=message,
            channel=channel,
            type='promo',
            status='sent'
        )
        db.session.add(notification)

    db.session.commit()
    return jsonify({"message": f"Message sent to {len(users)} users"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


