from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
import bcrypt

from .models import db, User, HashHistory
from .crypto_service import compute_hmac, verify_hmac, compute_steps, RFC_TEST_VECTOR

api = Blueprint("api", __name__, url_prefix="/api")


# ── helpers ───────────────────────────────────────────────────────────────────

def _bad(msg: str, code: int = 400):
    return jsonify({"error": msg}), code


def _ok(data: dict, code: int = 200):
    return jsonify(data), code


# ── auth endpoints ────────────────────────────────────────────────────────────

@api.post("/auth/register")
def register():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not username or not email or not password:
        return _bad("username, email and password are required")
    if len(password) < 6:
        return _bad("password must be at least 6 characters")
    if User.query.filter_by(username=username).first():
        return _bad("username already taken", 409)
    if User.query.filter_by(email=email).first():
        return _bad("email already registered", 409)

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(username=username, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return _ok({"token": token, "user": user.to_dict()}, 201)


@api.post("/auth/login")
def login():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    password = (body.get("password") or "")

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return _bad("invalid credentials", 401)

    token = create_access_token(identity=str(user.id))
    return _ok({"token": token, "user": user.to_dict()})


# ── HMAC endpoints ────────────────────────────────────────────────────────────

@api.post("/hmac/generate")
def hmac_generate():
    body = request.get_json(silent=True) or {}
    message = body.get("message", "")
    key = body.get("key", "")

    if not message or not key:
        return _bad("message and key are required")

    result = compute_hmac(message, key)

    # Save to history (anonymous if no token)
    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        user_id = int(uid) if uid else None
    except Exception:
        pass

    entry = HashHistory(
        user_id=user_id,
        message=message,
        secret_key=key,
        hmac_result=result,
        operation="generate",
    )
    db.session.add(entry)
    db.session.commit()

    return _ok({"hmac": result, "id": entry.id})


@api.post("/hmac/verify")
def hmac_verify():
    body = request.get_json(silent=True) or {}
    message = body.get("message", "")
    key = body.get("key", "")
    expected = body.get("expected", "")

    if not message or not key or not expected:
        return _bad("message, key and expected are required")

    ok = verify_hmac(message, key, expected)
    computed = compute_hmac(message, key)

    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        user_id = int(uid) if uid else None
    except Exception:
        pass

    entry = HashHistory(
        user_id=user_id,
        message=message,
        secret_key=key,
        hmac_result=computed,
        operation="verify",
        verified=ok,
    )
    db.session.add(entry)
    db.session.commit()

    return _ok({"verified": ok, "computed": computed, "expected": expected})


@api.post("/hmac/steps")
def hmac_steps():
    body = request.get_json(silent=True) or {}
    message = body.get("message", "")
    key = body.get("key", "")

    if not message or not key:
        return _bad("message and key are required")

    steps = compute_steps(message, key)
    return _ok({"steps": steps})


# ── history endpoints ─────────────────────────────────────────────────────────

@api.get("/history")
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    records = (
        HashHistory.query
        .filter_by(user_id=user_id)
        .order_by(HashHistory.created_at.desc())
        .limit(100)
        .all()
    )
    return _ok({"history": [r.to_dict() for r in records]})


@api.delete("/history/<int:record_id>")
@jwt_required()
def delete_history(record_id: int):
    user_id = int(get_jwt_identity())
    record = HashHistory.query.filter_by(id=record_id, user_id=user_id).first()
    if not record:
        return _bad("record not found", 404)
    db.session.delete(record)
    db.session.commit()
    return _ok({"deleted": True})


# ── test vector endpoint ──────────────────────────────────────────────────────

@api.get("/test-vector")
def test_vector():
    return _ok(RFC_TEST_VECTOR)


# ── health check ──────────────────────────────────────────────────────────────

@api.get("/health")
def health():
    return _ok({"status": "ok"})
