from flask_socketio import join_room, emit
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from backend.app.app import socketio
from models import User, Note, Permission, db
from y_py import YDoc, apply_update, encode_state_as_update
from datetime import datetime, timezone

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
    
    join_room(str(note_id))
    emit("join_note", {"message": f"{user_email} joined note {note_id} with {permission.permission} status"}, room=str(note_id))

@socketio.on("update_note_metadata")
def update_note_metadata(data):
    verify_jwt_in_request()
    user_email = get_jwt_identity()
    emit("update_note_metadata", {"user": user_email, "noteId": data["noteId"], 
                         "title": data["title"]}, room=data["noteId"])


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
    
@socketio.on("structured-update")
def structured_note_update(data):
    verify_jwt_in_request()

    note_id = data["noteId"]
    update = data["update"] 

    note = Note.query.get(note_id)
    if not note:
        emit("error", {"message": "Note not found"})
        return

    # Load existing Y.Doc
    ydoc = YDoc()
    with ydoc.begin_transaction() as txn:
        if note.ydoc_state:
            apply_update(ydoc, note.ydoc_state, txn=txn)

        apply_update(ydoc, update, txn=txn)

        # Save merged state
        merged_state = encode_state_as_update(ydoc, txn=txn)
        note.ydoc_state = merged_state
        note.updatedTime = datetime.now(timezone.utc)
        db.session.commit()

    emit("structured-update", {"update": update}, room=str(note_id), include_self=False)

@socketio.on("structured-load")
def structured_note_load(data):
    verify_jwt_in_request()
    note_id = data["noteId"]

    note = Note.query.get(note_id)
    if not note:
        emit("error", {"message": "Note not found"})
        return

    # If no state exists yet, send empty doc
    initial_state = note.ydoc_state or b""

    emit("structured-load", {"state": initial_state})

@socketio.on("unstructured-update")
def unstructured_note_update(data):
    verify_jwt_in_request()

    note_id = data["noteId"]
    scene = data["scene"]  # full Excalidraw scene JSON

    note = Note.query.get(note_id)
    if not note:
        emit("error", {"message": "Note not found"})
        return

    note.scene_json = scene
    note.updatedTime = datetime.now(timezone.utc)
    db.session.commit()

    emit("unstructured-update", scene, room=str(note_id), include_self=False)

@socketio.on("unstructured-load")
def unstructured_note_load(data):
    verify_jwt_in_request()
    note_id = data["noteId"]

    note = Note.query.get(note_id)
    if not note:
        emit("error", {"message": "Note not found"})
        return

    emit("unstructured-load", {"scene": note.scene_json or []})
