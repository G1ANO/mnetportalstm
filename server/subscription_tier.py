from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class SubscriptionTier(db.Model):
    __tablename__ = 'subscription_tiers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2))
    duration_days = db.Column(db.Integer)
    speed_limit = db.Column(db.Integer)
    data_limit = db.Column(db.Integer)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    feedbacks = db.relationship('Feedback', backref='tier', lazy=True)
    subscriptions = db.relationship('Subscription', backref='tier', lazy=True)