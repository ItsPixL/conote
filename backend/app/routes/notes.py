from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

notes_bp = Blueprint("main", __name__)

@notes_bp.route("/", methods=["GET"])
@jwt_required()
def dashboard():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    return jsonify({
        "success": True,
        "message": f"Welcome back, {user.username}!",
        "user": user.to_dict()
    })
