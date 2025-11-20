from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from datetime import timedelta
from models import db
from routes import register_bp

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "shivansh"
app.config['JWT_SECRET_KEY'] = 'jwt-secret'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=5)
socketio = SocketIO(app)

db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
register_bp(app)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    socketio.run(app, port=8000)
