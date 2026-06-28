from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.reservation import Reservation
from models.donation import Donation
from models.user import User

reservation_bp = Blueprint("reservation", __name__)


@reservation_bp.route("/create", methods=["POST"])
@jwt_required()
def create_reservation():

    ngo_id = get_jwt_identity()
    ngo = User.query.get(int(ngo_id))

    if ngo is None:
        return jsonify({
            "message": "User not found"
        }), 404

    if ngo.role != "ngo":
        return jsonify({
            "message": "Only NGOs can reserve donations"
        }), 403


    data = request.get_json()

    donation = Donation.query.get(data["donation_id"])

    if donation is None:
        return jsonify({
            "message": "Donation not found"
        }), 404

    if donation.status != "available":
        return jsonify({
            "message": "Donation is not available"
        }), 400

    reservation = Reservation(
        donation_id=donation.id,
        ngo_id=ngo_id,
        status="pending"
    )

    db.session.add(reservation)

    donation.status = "reserved"

    db.session.commit()

    return jsonify({
        "message": "Reservation created successfully"
    }), 201
@reservation_bp.route("/my", methods=["GET"])
@jwt_required()
def my_reservations():

    ngo_id = get_jwt_identity()

    reservations = Reservation.query.filter_by(
        ngo_id=int(ngo_id)
    ).all()

    result = []

    for reservation in reservations:

        donation = Donation.query.get(reservation.donation_id)

        result.append({
            "reservation_id": reservation.id,
            "donation_id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "address": donation.address,
            "status": reservation.status
        })

    return jsonify(result)
@reservation_bp.route("/<int:reservation_id>/pickup", methods=["PUT"])
@jwt_required()
def pickup_reservation(reservation_id):

    ngo_id = int(get_jwt_identity())

    reservation = Reservation.query.get(reservation_id)

    if reservation is None:
        return jsonify({
            "message": "Reservation not found"
        }), 404

    if reservation.ngo_id != ngo_id:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    if reservation.status != "pending":
        return jsonify({
            "message": "Food is already picked up"
        }), 400

    donation = Donation.query.get(reservation.donation_id)

    reservation.status = "picked_up"
    donation.status = "picked_up"

    db.session.commit()

    return jsonify({
        "message": "Food picked up successfully"
    }), 200
@reservation_bp.route("/<int:reservation_id>/complete", methods=["PUT"])
@jwt_required()
def complete_reservation(reservation_id):

    ngo_id = int(get_jwt_identity())

    reservation = Reservation.query.get(reservation_id)

    if reservation is None:
        return jsonify({
            "message": "Reservation not found"
        }), 404

    if reservation.ngo_id != ngo_id:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    if reservation.status != "picked_up":
        return jsonify({
            "message": "Food has not been picked up yet"
        }), 400

    donation = Donation.query.get(reservation.donation_id)

    reservation.status = "completed"
    donation.status = "completed"

    db.session.commit()

    return jsonify({
        "message": "Donation completed successfully"
    }), 200
