from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.donation import Donation
from datetime import datetime

donation_bp = Blueprint("donation", __name__)


@donation_bp.route("/create", methods=["POST"])
@jwt_required()
def create_donation():

    user_id = get_jwt_identity()

    data = request.get_json()

    donation = Donation(
        food_name=data["food_name"],
        quantity=data["quantity"],
        expiry_time=datetime.fromisoformat(data["expiry_time"]),
        address=data["address"],
        donor_id=user_id
    )

    db.session.add(donation)
    db.session.commit()

    return jsonify({
        "message": "Donation created successfully"
    }), 201
@donation_bp.route("/all", methods=["GET"])
@donation_bp.route("/all", methods=["GET"])
def get_all_donations():

    donations = Donation.query.all()

    result = []

    for donation in donations:
        result.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "expiry_time": donation.expiry_time.isoformat(),
            "address": donation.address,
            "status": donation.status,
            "donor_id": donation.donor_id
        })

    return jsonify(result)


@donation_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_donations():

    user_id = int(get_jwt_identity())

    donations = Donation.query.filter_by(donor_id=user_id).all()

    result = []

    for donation in donations:
        result.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "expiry_time": donation.expiry_time.isoformat(),
            "address": donation.address,
            "status": donation.status
        })

    return jsonify(result)
@donation_bp.route("/<int:id>", methods=["GET"])
def get_donation(id):

    donation = Donation.query.get(id)

    if donation is None:
        return jsonify({"message": "Donation not found"}), 404

    return jsonify({
        "id": donation.id,
        "food_name": donation.food_name,
        "quantity": donation.quantity,
        "expiry_time": donation.expiry_time.isoformat(),
        "address": donation.address,
        "status": donation.status,
        "donor_id": donation.donor_id
    })
@donation_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_donation(id):

    donation = Donation.query.get(id)

    if donation is None:
        return jsonify({"message": "Donation not found"}), 404

    data = request.get_json()

    donation.food_name = data.get("food_name", donation.food_name)
    donation.quantity = data.get("quantity", donation.quantity)
    donation.address = data.get("address", donation.address)

    if "expiry_time" in data:
        donation.expiry_time = datetime.fromisoformat(data["expiry_time"])

    db.session.commit()

    return jsonify({
        "message": "Donation updated successfully"
    })
@donation_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_donation(id):

    donation = Donation.query.get(id)

    if donation is None:
        return jsonify({"message": "Donation not found"}), 404

    # Only the donor who created the donation can delete it
    if donation.donor_id != int(get_jwt_identity()):
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(donation)
    db.session.commit()

    return jsonify({
        "message": "Donation deleted successfully"
    })