from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(25))
    lastName = db.Column(db.String(25))
    email = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email
        }

class Note(db.Model):
    __tablename__ = "notes"
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('users.id')) Will work on establishing relationships soon
    title = db.Column(db.String(50))
    createdTime = db.Column(db.DateTime, default=datetime.now())
    updatedTime = db.Column(db.DateTime, default=datetime.now())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "createdTime": self.createdTime,
            "updatedTime": self.updatedTime
        }

'''
class Content(db.Model):
    __tablename__ = "content"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(), default=None)
    # image = db.Column() Image storage still in consideration

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "image": self.image,
            "updatedTime": self.updatedTime
        } 
'''