from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Note, Permission, Content
from datetime import datetime, timezone
from models import db
from app import socketio
# from utils.upload_files import upload_file_to_s3

notes_bp = Blueprint("notes", __name__)

# Function to check if different entities exist
def validate(user="*", note="*", target_user="*", sharer_permission="*", sharing_permission="*"):
    if user != "*" and not user:
        return {"message": "User not found", "status": 404}
    if note != "*" and not note:
        return {"message": "Note not found", "status": 404}
    if target_user != "*" and not target_user:
        return {"message": "Target user not found", "status": 404}
    if sharer_permission != "*" and (not sharer_permission or not sharer_permission.permission):
        return {"message": "Sharer permission not found", "status": 404}
    if sharing_permission != "*" and (not sharing_permission or not sharing_permission.permission):
        return {"message": "Sharing permission not found", "status": 404}
    return None


def check_permission(note, user, level):
    print(note, user)
    permission = Permission.query.filter_by(user_id=user.id, note_id=note.id).first()
    print(permission, permission.permission)
    if not permission or permission.permission < level: # Doesn't have at least edit access
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
        "content": {"notes": user_notes, "user": user.to_dict()},
        "message": f"Welcome back, {user.username}!"
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
        "content": {"note": note.to_dict()},
        "message": "Note retrieved."
        }), 200


@notes_bp.route("/create", methods=["POST"])
@jwt_required()
def create_note():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    validate_errors = validate(user=user)
    if validate_errors:
        return jsonify({"success": False, "message": validate_errors["message"]}), validate_errors["status"]
   
    data = request.get_json()
    title, description, noteType = data.get("title"), data.get("description"), data.get("noteType")
    if not title:
        return jsonify({"success": False, "message": "Title must be provided."}), 401
    
    note = Note(user_id=user.id, title=title, description=description, noteType=noteType)
    db.session.add(note)
    db.session.flush()
    permission = Permission(user_id=user.id, note_id=note.id, permission=3)
    db.session.add(permission)
    db.session.commit()

    return jsonify({
        "success": True,
        "content": {"note": note.to_dict(), "permission": permission.to_dict()},
        "message": "Note created successfully"
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
    
    if not check_permission(note, user, 2):
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
        "content": {"note": note.to_dict()},
        "message": "Note updated successfully"
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
    
    if not check_permission(user, note, 3):
        return jsonify({"success": False, "message": "Only the note owner can delete the note!"}), 403

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
    
    if not check_permission(note, user, 2):
        return jsonify({"success": False, "message": "Access denied due to insufficient permissions"}), 403
    
    permission_level = data.get("permission")
    if not permission_level or permission_level not in [1, 2, 3]:
        return jsonify({"success": False, "message": "No permission status given."}), 400
    # Check if permission already exists (this is for the person whom the file is being shared to)
    existing = Permission.query.filter_by(user_id=target_user.id, note_id=note.id).first()
    if existing:
        existing.permission = permission_level  # Update permission if already shared
    else:
        new_permission = Permission(user_id=target_user.id, note_id=note.id, permission=permission_level)
        db.session.add(new_permission)

    db.session.commit()

    socketio.emit(
    "share_note",
    {
        "noteId": note.id,
        "sharedBy": user.username,
        "sharedWith": target_user.username,
        "permission": permission_level
    },
    room=str(note.id))   

    return jsonify({
        "success": True,
        "content": {"permission": permission_level},
        "message": f"Note shared with {target_username} with permission level {permission_level}"
    }), 200


@notes_bp.route("/<int:note_id>/unshare", methods=["DELETE"])
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
    
    if sharer_permission.permission < 2: # The person who is unsharing must have at least edit access
        return jsonify({"success": False, "message": "Access denied due to insufficient permissions"}), 403
    if sharing_permission.permission == 3: # The person who is being unshared can't be the owner
        return jsonify({"success": False, "message": "Can't remove the owner of the note!"}), 403
    
    db.session.delete(sharing_permission)
    db.session.commit()

    socketio.emit(
    "unshare_note",
    {
        "noteId": note.id,
        "unsharedBy": user.username,
        "targetUser": target_user.username,
    },
    room=str(note.id))   

    return jsonify({
        "success": True,
        "message": f"{target_username}'s permission has been removed."
    }), 200

# @notes_bp.route("/upload_thumbnail/<int:note_id>", methods=["POST"])
# @jwt_required()
# def upload_thumbnail(note_id):
#     file = request.files.get("thumbnail")
#     if not file:
#         return jsonify({"success": False, "message": "No file uploaded"}), 400

#     file_url = upload_file_to_s3(file, current_app, current_app.config["S3_BUCKET"])
#     if not file_url:
#         return jsonify({"success": False, "message": "Upload failed"}), 500

#     content = Content(note_id=note_id, text=None, imageUrl=file_url) # Need to implement coordPos
#     db.session.add(content)
#     db.session.commit()

#     return jsonify({"success": True, "content": {"thumbnailUrl": file_url}, "message": "Thumbnail uploaded"}), 200