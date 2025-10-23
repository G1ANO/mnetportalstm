from flask import Flask, jsonify,request
from flask_migrate import Migrate
from models import db, bcrypt, User, SubscriptionTier 
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
#this registers a new user and requires name,email,password and phonenumber 


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
#here i log in a user by checking email and password and returns basic user info if successful
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
#this returns all available subscription plans.

if __name__ == '__main__':
    app.run(debug=True)



