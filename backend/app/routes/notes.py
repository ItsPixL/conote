from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Note, Permission
from datetime import datetime, timezone
from models import db

notes_bp = Blueprint("main", __name__)

@notes_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_notes():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    user_notes = [note.to_dict() for note in user.notes]
    return jsonify({
        "success": True,
        "message": f"Welcome back, {user.username}!",
        "notes": user_notes,
        "user": user.to_dict()
    }), 200

@notes_bp.route("/<int:note_id>", methods=["GET"])
@jwt_required()
def get_single_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    if not note:
        return jsonify({"success": False, "message": "Note not found"}), 404

    return jsonify({
        "success": True,
        "note": note.to_dict()
    }), 200

@notes_bp.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    if not note:
        return jsonify({"success": False, "message": "Note not found"}), 404

    data = request.get_json()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)
    note.updatedTime = datetime.now(timezone.utc)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Note updated successfully",
        "note": note.to_dict()
    }), 200

@notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    if not note:
        return jsonify({"success": False, "message": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Note deleted successfully"
    }), 200

@notes_bp.route("/<int:note_id>/share", methods=["POST"])
@jwt_required()
def share_note(note_id):
    current_user_email = get_jwt_identity()
    owner = User.query.filter_by(email=current_user_email).first()

    if not owner:
        return jsonify({"success": False, "message": "User not found"}), 404

    note = Note.query.filter_by(id=note_id, user_id=owner.id).first()
    if not note:
        return jsonify({"success": False, "message": "Note not found or access denied"}), 404

    data = request.get_json()
    target_username = data.get("user")
    permission_level = data.get("permission")

    if not target_username or not permission_level:
        return jsonify({"success": False, "message": "Missing user or permission"}), 400

    target_user = User.query.filter_by(username=target_username).first()
    if not target_user:
        return jsonify({"success": False, "message": "Target user not found"}), 404

    # Check if permission already exists
    existing = Permission.query.filter_by(user_id=target_user.id, note_id=note.id).first()
    if existing:
        existing.permission = permission_level  # Update permission if already shared
    else:
        new_permission = Permission(user_id=target_user.id, note_id=note.id, permission=permission_level)
        db.session.add(new_permission)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"Note shared with {target_username} as '{permission_level}'"
    }), 200
