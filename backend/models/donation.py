from extensions import db
from datetime import datetime

class Donation(db.Model):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)

    food_name = db.Column(db.String(100), nullable=False)

    quantity = db.Column(db.Integer, nullable=False)

    expiry_time = db.Column(db.DateTime, nullable=False)

    address = db.Column(db.Text, nullable=False)

    status = db.Column(db.String(20), default="available")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    donor_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )