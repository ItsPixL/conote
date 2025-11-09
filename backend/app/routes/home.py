from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

home_bp = Blueprint("main", __name__)

@home_bp.route("/", methods=["GET"])
@jwt_required()
def home():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    return jsonify({
        "success": True,
        "message": f"Welcome back, {user.firstName}!",
        "user": user.to_dict()
    })
