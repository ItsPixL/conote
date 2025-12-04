from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint("auth", __name__)
 
# Reminder to add password validation (e.g. at least 8 chars, usage of special keys etc.)
@auth_bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email").strip()
    username = data.get("username").strip()
    
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists"}), 409

    user = User(username=username, email=email)
    
    user.set_password(data.get("password"))
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "content": {"user": user.to_dict()}, "message": "User registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password")):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.email)
    return jsonify({"success": True, "content": {"token": token, "user": user.to_dict()}, "message": "User logged in"}), 200

@auth_bp.route("/user", methods=["GET"])
@jwt_required()
def get_user_data():
   current_user_email = get_jwt_identity()
   user = User.query.filter_by(email=current_user_email).first()
  
   if not user:
       return jsonify({"success": False, "message": "User not found"}), 404
  
   return jsonify({
       "success": True,
       "content": {"user": user.to_dict()},
       "message": f"Welcome back, {user.username}!"
       }), 200