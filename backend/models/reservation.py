from extensions import db

class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)

    donation_id = db.Column(
        db.Integer,
        db.ForeignKey("donations.id"),
        nullable=False
    )

    ngo_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    status = db.Column(db.String(20), default="pending")
    