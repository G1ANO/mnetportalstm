from flask import Flask, jsonify,request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, bcrypt, User, SubscriptionTier, Subscription, Feedback, Complaint, LoyaltyPoint, Notification
from config import Config
from datetime import datetime, timedelta, timezone

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

    return jsonify({
        "message": "User registered successfully",
        "user_id": user.id,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 201

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
    """Fetch feedbacks/complaints (admin sees all, user sees own)."""
    user_id = request.args.get('user_id')
    subscription_type = request.args.get('subscription_type')  # Optional filter for admin
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role == 'admin':
        # Admin can filter by subscription_type
        if subscription_type:
            feedbacks = Feedback.query.filter_by(subscription_type=subscription_type).all()
        else:
            feedbacks = Feedback.query.all()
    else:
        feedbacks = Feedback.query.filter_by(user_id=user.id).all()

    result = [{
        "id": f.id,
        "user_id": f.user_id,
        "type": f.type,
        "subscription_type": f.subscription_type,
        "subject": f.subject,
        "rating": f.rating,
        "comment": f.comment,
        "status": f.status,
        "admin_response": f.admin_response,
        "created_at": f.created_at.isoformat() if f.created_at else None,
        "updated_at": f.updated_at.isoformat() if f.updated_at else None
    } for f in feedbacks]
    return jsonify(result), 200

@app.route('/feedbacks', methods=['POST'])
def add_feedback():
    """User submits feedback or complaint."""
    data = request.get_json()
    user_id = data.get('user_id')
    feedback_type = data.get('type', 'feedback')  # 'feedback' or 'complaint'
    subscription_type = data.get('subscription_type', 'hotspot')  # 'hotspot' or 'home_internet'

    feedback = Feedback(
        user_id=user_id,
        type=feedback_type,
        subscription_type=subscription_type,
        subject=data.get('subject'),
        rating=data.get('rating'),  # Optional for complaints
        comment=data.get('comment'),
        status='pending'
    )
    db.session.add(feedback)
    db.session.commit()

    message = "Feedback submitted successfully" if feedback_type == 'feedback' else "Complaint submitted successfully"
    return jsonify({"message": message}), 201

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

    # Create notification for the user about the complaint response
    notification = Notification(
        user_id=complaint.user_id,
        message=f"Your complaint '{complaint.subject}' has been addressed by admin.",
        channel='notification',
        type='complaint_response',
        status='unread'
    )
    db.session.add(notification)

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
    notes = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()

    result = [{
        "id": n.id,
        "message": n.message,
        "channel": n.channel,
        "type": n.type,
        "status": n.status,
        "created_at": n.created_at.isoformat() if n.created_at else None
    } for n in notes]

    return jsonify(result), 200

@app.route('/notifications/<int:notification_id>/read', methods=['PATCH'])
def mark_notification_read(notification_id):
    """Mark a notification as read."""
    notification = Notification.query.get_or_404(notification_id)
    notification.status = 'read'
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200

@app.route('/notifications/mark-all-read', methods=['PATCH'])
def mark_all_notifications_read():
    """Mark all user notifications as read."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    Notification.query.filter_by(user_id=user_id, status='unread').update({'status': 'read'})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200

@app.route('/users', methods=['GET'])
def get_users():
    """Get all users with their subscription info (admin only)."""
    # Auto-expire subscriptions before fetching user data
    now = datetime.now(timezone.utc)
    active_subscriptions = Subscription.query.filter_by(status='active').all()
    for s in active_subscriptions:
        if s.end_date:
            # Handle both timezone-aware and naive datetimes
            end_date = s.end_date
            if end_date.tzinfo is None:
                # If naive, assume it's UTC and make it aware
                end_date = end_date.replace(tzinfo=timezone.utc)
            if end_date < now:
                s.status = 'expired'
    db.session.commit()

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
            "usage_mb": getattr(u, 'usage_mb', 0),
            "created_at": u.created_at.isoformat() if u.created_at else None
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
            "id": lp.id,
            "user_id": lp.user_id,
            "user_name": user.name if user else None,
            "user_email": user.email if user else None,
            "phone_number": user.phone_number if user else None,
            "device_id": getattr(user, 'device_id', None) if user else None,
            "points_earned": lp.points_earned,
            "points_redeemed": lp.points_redeemed,
            "balance": lp.balance
        })
    return jsonify(result), 200

@app.route('/analytics/tier-subscriptions', methods=['GET'])
def get_tier_subscription_analytics():
    """Get subscription count by tier for analytics (admin only)."""
    tier_type = request.args.get('type', 'hotspot')  # Default to hotspot

    # Get all tiers of the specified type
    tiers = SubscriptionTier.query.filter_by(tier_type=tier_type).all()

    result = []
    for tier in tiers:
        # Count active subscriptions for this tier
        active_count = Subscription.query.filter_by(tier_id=tier.id, status='active').count()
        # Count all subscriptions (including expired) for this tier
        total_count = Subscription.query.filter_by(tier_id=tier.id).count()

        result.append({
            "tier_id": tier.id,
            "tier_name": tier.name,
            "price": float(tier.price),
            "active_subscribers": active_count,
            "total_subscribers": total_count,
            "duration_hours": tier.duration_days
        })

    return jsonify(result), 200

@app.route('/feedbacks/<int:feedback_id>/reply', methods=['PATCH'])
def reply_to_feedback(feedback_id):
    """Admin responds to feedback or complaint."""
    data = request.get_json()
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)

    if not admin or admin.role != 'admin':
        return jsonify({"error": "Admins only"}), 403

    feedback = Feedback.query.get_or_404(feedback_id)
    feedback.admin_response = data.get('admin_response')
    feedback.status = data.get('status', 'resolved')

    # Create notification for the user about the feedback/complaint response
    feedback_type_label = 'complaint' if feedback.type == 'complaint' else 'feedback'
    subject_text = feedback.subject if feedback.subject else 'your submission'
    notification = Notification(
        user_id=feedback.user_id,
        message=f"Admin has responded to your {feedback_type_label}: {subject_text}",
        channel='notification',
        type='feedback_response',
        status='unread'
    )
    db.session.add(notification)

    db.session.commit()
    return jsonify({"message": "Response sent successfully"}), 200

@app.route('/subscriptions', methods=['POST'])
def create_subscription():
    """User subscribes to a tier."""
    data = request.get_json()
    user_id = data.get('user_id')
    tier_id = data.get('tier_id')

    tier = SubscriptionTier.query.get_or_404(tier_id)

    # Get current time for subscription start and old subscription termination
    current_time = datetime.now(timezone.utc)

    # Mark all existing active subscriptions for this user and tier type as expired
    # and update their end_date to the current time (when they were terminated)
    existing_subscriptions = Subscription.query.filter_by(user_id=user_id, status='active').all()
    for sub in existing_subscriptions:
        existing_tier = SubscriptionTier.query.get(sub.tier_id)
        if existing_tier and existing_tier.tier_type == tier.tier_type:
            sub.status = 'expired'
            sub.end_date = current_time  # Set end_date to when it was actually terminated

    # Calculate end date based on duration_days (using timezone-aware datetime)
    start_date = current_time
    end_date = start_date + timedelta(hours=tier.duration_days)  # Assuming duration_days is actually hours

    subscription = Subscription(
        user_id=user_id,
        tier_id=tier_id,
        start_date=start_date,
        end_date=end_date,
        status='active'
    )
    db.session.add(subscription)

    # Award loyalty points: 10 points per shilling spent
    # e.g., 10 KSH package = 100 points, 50 KSH = 500 points
    points_to_award = int(tier.price * 10)

    loyalty = LoyaltyPoint.query.filter_by(user_id=user_id).first()
    if not loyalty:
        loyalty = LoyaltyPoint(user_id=user_id, points_earned=points_to_award, points_redeemed=0, balance=points_to_award)
        db.session.add(loyalty)
    else:
        loyalty.points_earned += points_to_award
        loyalty.balance += points_to_award

    db.session.commit()
    return jsonify({"message": "Subscription created successfully"}), 201

@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    """Get user subscriptions."""
    user_id = request.args.get('user_id')
    tier_type = request.args.get('type')  # Optional filter: 'hotspot' or 'home_internet'

    subscriptions = Subscription.query.filter_by(user_id=user_id).order_by(Subscription.start_date.desc()).all()

    # Auto-update expired subscriptions (using timezone-aware datetime)
    now = datetime.now(timezone.utc)
    for s in subscriptions:
        if s.status == 'active' and s.end_date:
            # Handle both timezone-aware and naive datetimes
            end_date = s.end_date
            if end_date.tzinfo is None:
                # If naive, assume it's UTC and make it aware
                end_date = end_date.replace(tzinfo=timezone.utc)
            if end_date < now:
                s.status = 'expired'
    db.session.commit()

    result = []
    for s in subscriptions:
        tier = SubscriptionTier.query.get(s.tier_id)

        # Filter by tier_type if specified
        if tier_type and tier and tier.tier_type != tier_type:
            continue

        result.append({
            "id": s.id,
            "tier_id": s.tier_id,
            "tier_name": tier.name if tier else None,
            "tier_type": tier.tier_type if tier else None,
            "price": float(tier.price) if tier else None,
            "duration_days": tier.duration_days if tier else None,
            "speed_limit": tier.speed_limit if tier else None,
            "status": s.status,
            "start_date": s.start_date.isoformat() if s.start_date else None,
            "end_date": s.end_date.isoformat() if s.end_date else None
        })
    return jsonify(result), 200

@app.route('/loyalty/redeem', methods=['POST'])
def redeem_loyalty_points():
    """Redeem loyalty points for a subscription tier.

    Redemption rate: 70 points per 1 KSH
    e.g., 10 KSH package requires 700 points
          50 KSH package requires 3500 points
    """
    data = request.get_json()
    user_id = data.get('user_id')
    tier_id = data.get('tier_id')  # The tier to redeem

    if not tier_id:
        return jsonify({"error": "Tier ID is required"}), 400

    # Get the tier
    tier = SubscriptionTier.query.get(tier_id)
    if not tier:
        return jsonify({"error": "Tier not found"}), 404

    # Calculate points required: 70 points per shilling
    points_required = int(tier.price * 70)

    # Check user's loyalty balance
    loyalty = LoyaltyPoint.query.filter_by(user_id=user_id).first()
    if not loyalty or loyalty.balance < points_required:
        return jsonify({
            "error": "Insufficient points",
            "required": points_required,
            "available": loyalty.balance if loyalty else 0
        }), 400

    # Get current time for subscription
    current_time = datetime.now(timezone.utc)

    # Mark all existing active subscriptions for this user and tier type as expired
    existing_subscriptions = Subscription.query.filter_by(user_id=user_id, status='active').all()
    for sub in existing_subscriptions:
        existing_tier = SubscriptionTier.query.get(sub.tier_id)
        if existing_tier and existing_tier.tier_type == tier.tier_type:
            sub.status = 'expired'
            sub.end_date = current_time

    # Create the subscription
    start_date = current_time
    end_date = start_date + timedelta(hours=tier.duration_days)

    subscription = Subscription(
        user_id=user_id,
        tier_id=tier_id,
        start_date=start_date,
        end_date=end_date,
        status='active'
    )
    db.session.add(subscription)

    # Deduct points
    loyalty.points_redeemed += points_required
    loyalty.balance -= points_required

    # Create redemption record
    from models import Redemption
    redemption = Redemption(
        user_id=user_id,
        points_used=points_required,
        reward_type='subscription',
        details=f"Redeemed {tier.name} subscription for {points_required} points"
    )
    db.session.add(redemption)

    db.session.commit()
    return jsonify({
        "message": "Subscription redeemed successfully!",
        "points_used": points_required,
        "remaining_balance": loyalty.balance
    }), 200

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
        users = User.query.filter(User.role != 'admin').all()  # Exclude admins
    elif recipients == 'active':
        users = User.query.filter_by(status='active').filter(User.role != 'admin').all()  # Exclude admins
    elif recipients == 'specific':
        users = User.query.filter(User.id.in_(specific_users)).filter(User.role != 'admin').all()  # Exclude admins
    else:
        return jsonify({"error": "Invalid recipients"}), 400

    # Create notifications for each user
    for user in users:
        notification = Notification(
            user_id=user.id,
            message=message,
            channel=channel,
            type='promo',
            status='unread'  # Changed from 'sent' to 'unread' to trigger bell notification
        )
        db.session.add(notification)

    db.session.commit()
    return jsonify({"message": f"Message sent to {len(users)} users"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


