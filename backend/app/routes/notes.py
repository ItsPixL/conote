from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Note, Permission
from datetime import datetime, timezone
from models import db
from app import socketio

notes_bp = Blueprint("main", __name__)


def validate(user="*", note="*", target_user="*", sharer_permission="*", sharing_permission="*"):
    if user != "*" and not user:
        return {"message": "User not found", "status": 404}
    if note != "*" and not note:
        return {"message": "User not found", "status": 404}
    if target_user != "*" and not target_user:
        return {"message": "Target user not found", "status": 404}
    if sharer_permission != "*" and (not sharer_permission or not sharer_permission.permission):
        return {"message": "Sharer permission not found", "status": 404}
    if sharing_permission != "*" and (not sharing_permission or not sharing_permission.permission):
        return {"message": "Sharing permission not found", "status": 404}
    return None


def check_edit_permission(note, user):
    if note.user_id != user.id:
        permission = Permission.query.filter_by(user_id=user.id, note_id=note.id).first()
        if not permission or permission.level() >= 2:
            return False
    return True

    
@notes_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_notes():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    validate_errors = validate(user=user)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]
    
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
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()

    validate_errors = validate(user=user, note=note)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]

    return jsonify({
        "success": True,
        "note": note.to_dict()
    }), 200


@notes_bp.route("/<int:note_id>", methods=["PATCH"])
@jwt_required()
def update_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()

    validate_errors = validate(user=user, note=note)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]
    
    if not check_edit_permission(note, user):
        return jsonify({"success": False, "message": "Access denied due to insufficient permissions"}), 403

    data = request.get_json()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)
    note.updatedTime = datetime.now(timezone.utc)
    db.session.commit()

    socketio.emit(
        "update_note",
        {"noteId": note.id, "title": note.title, "content": note.content, "user": user.username},
        room=str(note.id)
    )

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
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()

    validate_errors = validate(user=user, note=note)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]

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
    data = request.get_json()
    target_username = data.get("user")
    user = User.query.filter_by(email=current_user_email).first()
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    target_user = User.query.filter_by(username=target_username).first()
    # This is the permission level of the person sharing the file, not the person who it is being shared to
    sharer_permission = Permission.query.filter_by(user_id=user.id, note_id=note.id).first() 

    validate_errors = validate(user=user, note=note, target_user=target_user, sharer_permission=sharer_permission)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]
    
    if not check_edit_permission(note, user):
        return jsonify({"success": False, "message": "Access denied due to insufficient permissions"}), 403
    
    permission_status = data.get("permission")
    # Check if permission already exists (this is for the person whom the file is being shared to)
    existing = Permission.query.filter_by(user_id=target_user.id, note_id=note.id).first()
    if existing:
        existing.permission = permission_status  # Update permission if already shared
    else:
        new_permission = Permission(user_id=target_user.id, note_id=note.id, permission=permission_status)
        db.session.add(new_permission)

    db.session.commit()

    socketio.emit(
    "share_note",
    {
        "noteId": note.id,
        "sharedBy": user.username,
        "sharedWith": target_user.username,
        "permission": permission_status
    },
    room=str(note.id))   

    return jsonify({
        "success": True,
        "message": f"Note shared with {target_username} as '{permission_status}'"
    }), 200


@notes_bp.route("/<int:note_id>/unshare", methods=["POST"])
@jwt_required()
def unshare_note(note_id):
    current_user_email = get_jwt_identity()
    data = request.get_json()
    target_username = data.get("user")
    user = User.query.filter_by(email=current_user_email).first()
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    target_user = User.query.filter_by(username=target_username).first()
    sharer_permission = Permission.query.filter_by(user_id=user.id, note_id=note.id).first() 
    sharing_permission = Permission.query.filter_by(user_id=target_user.id, note_id=note.id).first() 

    validate_errors = validate(user=user, note=note, target_user=target_user, sharer_permission=sharer_permission, 
                               sharing_permission=sharing_permission)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]
