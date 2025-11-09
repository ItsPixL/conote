from routes.auth import auth_bp
from routes.home import home_bp

def register_bp(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(home_bp, url_prefix="/home")
