from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import (
    JWTManager,
    create_access_token
)
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = "dev-secret-key-change-later"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)

# --------------------
# Health Check
# --------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# --------------------
# Login Endpoint
# --------------------
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    # TEMPORARY: hardcoded credentials
    if username == "doctor" and password == "password123":
        token = create_access_token(identity=username)
        return jsonify({
            "access_token": token,
            "user": {
                "username": username,
                "role": "doctor"
            }
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

# --------------------
# Protected Route
# --------------------
@app.route("/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()

    return jsonify({
        "username": current_user,
        "role": "doctor"
    }), 200
    
if __name__ == "__main__":
    app.run(debug=True, port=5001)