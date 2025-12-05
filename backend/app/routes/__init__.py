from routes.auth import auth_bp
from routes.notes import notes_bp
from routes.ai import ai_bp

def register_bp(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(notes_bp, url_prefix="/note")
    app.register_blueprint(ai_bp, url_prefix="/ai")
