from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from datetime import timedelta
from models import db
import os
from gevent import pywsgi 
from geventwebsocket.handler import WebSocketHandler 
from geventwebsocket import WebSocketError 
from ypy_websocket import WebsocketServer

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

ws_server = WebsocketServer()

@app.route("/ws/<room>") 
def collaboration_socket(room): 
    # Check if this is a WebSocket request 
    if "wsgi.websocket" not in request.environ: 
        return jsonify({"success": False, "message": "Only websockets requests are allowed!"}), 400 
    ws = request.environ["wsgi.websocket"] 
    try: 
        yroom = ws_server.get_room(room) 
        ws_server.serve(ws, yroom) 
    except WebSocketError: 
        pass   
    return ""


if __name__ == "__main__":
    from routes import register_bp
    register_bp(app)
    with app.app_context():
        db.create_all()
        print(db.metadata.tables.keys())

    server = pywsgi.WSGIServer(
        ("0.0.0.0", 8000),
        app,
        handler_class=WebSocketHandler
    )
    server.serve_forever()
