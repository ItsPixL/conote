from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint("auth", __name__)
 
# Reminder to add password validation (e.g. at least 8 chars, usage of special keys etc.)
@auth_bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists"}), 409

    user = User(
        username=username,
        email=email,
    )
    user.set_password(data.get("password"))
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password")):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.email)
    return jsonify({"success": True, "token": token, "user": user.to_dict()}), 200
