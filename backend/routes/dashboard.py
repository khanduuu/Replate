from flask import Blueprint, jsonify

from sqlalchemy import func
from datetime import datetime, timedelta

from models.donation import Donation
from models.user import User

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def dashboard():

    total_donations = Donation.query.count()

    available = Donation.query.filter_by(
        status="available"
    ).count()

    reserved = Donation.query.filter_by(
        status="reserved"
    ).count()

    picked_up = Donation.query.filter_by(
        status="picked_up"
    ).count()

    completed = Donation.query.filter_by(
        status="completed"
    ).count()

    total_donors = User.query.filter_by(
        role="donor"
    ).count()

    total_ngos = User.query.filter_by(
        role="ngo"
    ).count()

    return jsonify({
        "total_donations": total_donations,
        "available": available,
        "reserved": reserved,
        "picked_up": picked_up,
        "completed": completed,
        "total_donors": total_donors,
        "total_ngos": total_ngos
    })
