from flask import Flask, jsonify,request
from flask_migrate import Migrate
from models import db, bcrypt, User, SubscriptionTier, Feedback, Complaint, LoyaltyPoint, Notification
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

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
        "user": {"id": user.id, "email": user.email, "role": user.role}
    }), 200

@app.route('/tiers', methods=['GET'])
def get_tiers():
    tiers = SubscriptionTier.query.all()
    result = [{
        "id": t.id,
        "name": t.name,
        "price": float(t.price),
        "duration_days": t.duration_days,
        "speed_limit": t.speed_limit,
        "data_limit": t.data_limit,
        "description": t.description
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
        description=data.get('description')
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


