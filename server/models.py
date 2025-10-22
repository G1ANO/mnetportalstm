from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)  # Unique user ID
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(30))
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#first i create a user model that represents a user in the WiFi system it can be either a normal user or an admin.
    
    #  Relationships 
    subscriptions = db.relationship('Subscription', backref='user', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)
    feedbacks = db.relationship('Feedback', backref='user', lazy=True)
    complaints = db.relationship('Complaint', backref='user', lazy=True)
    loyalty_points = db.relationship('LoyaltyPoint', backref='user', lazy=True)
    redemptions = db.relationship('Redemption', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    usage_patterns = db.relationship('UsagePattern', backref='user', lazy=True)

    #this are password helper methods
    def set_password(self, password):
        """Hashes and stores the user's password securely."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verifies if a given password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)


#admin action log model to keep track of admin activities
class AdminActionLog(db.Model):
    __tablename__ = 'admin_action_logs'  

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    
    admin = db.relationship('User', foreign_keys=[admin_id], backref='admin_actions')
    target_user = db.relationship('User', foreign_keys=[target_user_id], backref='targeted_actions')

    def __repr__(self):
        return f"<AdminActionLog {self.action} by Admin {self.admin_id} on User {self.target_user_id}>"
