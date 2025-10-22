from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ========== LOYALTY POINTS ==========
class LoyaltyPoint(db.Model):
    __tablename__ = 'loyalty_points'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    points_earned = db.Column(db.Integer, default=0)
    points_redeemed = db.Column(db.Integer, default=0)
    balance = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class Redemption(db.Model):
    __tablename__ = 'redemptions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    points_used = db.Column(db.Integer)
    reward_type = db.Column(db.String(100))
    metadata = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)