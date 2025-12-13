from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from datetime import timedelta
from models import db, User, Note, Permission, Content, Version
import os

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH"]
)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "shivansh"
app.config['JWT_SECRET_KEY'] = 'jwt-secret'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=5)
app.config["S3_BUCKET"] = os.getenv("S3_BUCKET_NAME")
app.config["S3_KEY"] = os.getenv("AWS_ACCESS_KEY_ID")
app.config["S3_SECRET"] = os.getenv("AWS_SECRET_ACCESS_KEY")
app.config["S3_LOCATION"] = f"https://{app.config['S3_BUCKET']}.s3.amazonaws.com/"
socketio = SocketIO(app)

db.init_app(app)
jwt = JWTManager(app)

if __name__ == "__main__":
    from routes import register_bp
    register_bp(app)
    with app.app_context():
        db.create_all()
        print(db.metadata.tables.keys())
    socketio.run(app, port=8000, debug=True)
