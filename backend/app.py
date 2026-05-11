"""
HMAC-SHA-256 Educational Platform  –  Flask entry point
Run locally:  python app.py
Production:   gunicorn "backend.app:create_app()"
"""

import os
from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

from .models import db
from .routes import api

load_dotenv()


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder="../static",
        template_folder="../templates",
    )

    # ── configuration ──────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-production")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///hmac_app.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── extensions ─────────────────────────────────────────────────────────
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ── blueprints ─────────────────────────────────────────────────────────
    app.register_blueprint(api)

    # ── serve frontend ─────────────────────────────────────────────────────
    @app.route("/")
    def index():
        return send_from_directory(app.template_folder, "index.html")

    @app.route("/static/<path:path>")
    def static_files(path):
        return send_from_directory(app.static_folder, path)

    # ── create tables on first run ─────────────────────────────────────────
    with app.app_context():
        db.create_all()

    return app


# Allow running directly:  python -m backend.app
if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, host="0.0.0.0", port=5000)
