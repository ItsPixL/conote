from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    notes = db.relationship('Note', backref='user', lazy=True)
    permissions = db.relationship('Permission', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class Note(db.Model):
    __tablename__ = "notes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(50))
    description = db.Column(db.String(250))
    content = db.Column(db.Text)
    createdTime = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updatedTime = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    permissions = db.relationship('Permission', backref='note', lazy=True)
    versions = db.relationship('Version', backref='note', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "description": self.description,
            "content": self.content,
            "createdTime": self.createdTime,
            "updatedTime": self.updatedTime
        }

class Permission(db.Model):
    __tablename__ = "permissions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=False)
    permission = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "noteId": self.note_id,
            "permission": self.permission
        }
    

class Version(db.Model):
    __tablename__ = "versions"
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=False)
    content_snapshot = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "note_id": self.note_id,
            "content_snapshot": self.content_snapshot,
            "timestamp": self.timestamp
        } 
