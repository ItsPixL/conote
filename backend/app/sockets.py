from flask_socketio import join_room, emit
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app import socketio
from models import User, Note, Permission

@socketio.on("join_note")
def join(data):
    verify_jwt_in_request()
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    note_id = data["noteId"]

    permission = Permission.query.filter_by(user_id=user.id, note_id=note_id).first()
    if not permission:
        emit("error", {"message": "Access denied"})
        return
    
    join_room(note_id)
    emit("join_note", {"message": f"{user_email} joined note {note_id} with {permission.permission} status"}, room=note_id)

@socketio.on("update_note")
def handle_update(data):
    verify_jwt_in_request()
    user_email = get_jwt_identity()
    emit("update_note", {"user": user_email, "noteId": data["noteId"], 
                         "title": data["title"], "content": data["content"]}, room=data["noteId"])


@socketio.on("share_note")
def share_note(data):
    verify_jwt_in_request()
    user_email = get_jwt_identity()
    emit("share_note", {"user": user_email, "noteId": data["noteId"], 
                        "sharedBy": data["sharedBy"], "sharedWith": data["sharedWith"],
                        "permission": data["permission"]}, room=data["noteId"])

@socketio.on("unshare_note")
def unshare_note(data):
    verify_jwt_in_request()
    user_email = get_jwt_identity()
    emit("unshare_note", {"user": user_email, "noteId": data["noteId"], 
                          "unsharedBy": data["unsharedBy"], "targetUser": data["targetUser"]},
                          room=data["noteId"])