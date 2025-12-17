# app.py
from gevent import monkey
monkey.patch_all()  

from flask import Flask
from flask_cors import CORS
from datetime import timedelta
import os

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
from ypy_websocket import WebsocketServer

from extensions import db, jwt, socketio
from routes import register_bp

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
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "shivansh")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=5)
app.config["S3_BUCKET"] = os.getenv("S3_BUCKET_NAME")
app.config["S3_KEY"] = os.getenv("AWS_ACCESS_KEY_ID")
app.config["S3_SECRET"] = os.getenv("AWS_SECRET_ACCESS_KEY")
if app.config.get("S3_BUCKET"):
    app.config["S3_LOCATION"] = f"https://{app.config['S3_BUCKET']}.s3.amazonaws.com/"

db.init_app(app)
jwt.init_app(app)
socketio.init_app(app)

register_bp(app)

ws_server = WebsocketServer()

def websocket_app(environ, start_response):
    """
    Dispatch:
      - /ws/<note_id> -> Ypy WebSocket server
      - everything else -> Flask app (HTTP & Socket.IO)
    """
    path = environ.get("PATH_INFO", "")
    if path.startswith("/ws/"):
        if "wsgi.websocket" not in environ:
            start_response("400 Bad Request", [])
            return [b"WebSocket connection required"]

        ws = environ["wsgi.websocket"]
        room = path.split("/")[-1]
        yroom = ws_server.get_room(room)

        try:
            ws_server.serve(ws, yroom)
        except Exception:
            pass

        return []

    return app(environ, start_response)

if __name__ == "__main__":
    print("Starting unified Flask + Socket.IO + Yjs server on :8000")
    with app.app_context():
        db.create_all()

    server = pywsgi.WSGIServer(
        ("0.0.0.0", 8000),
        websocket_app,
        handler_class=WebSocketHandler
    )
    server.serve_forever()
