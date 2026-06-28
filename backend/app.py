from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt

from models.user import User
from models.donation import Donation
from models.reservation import Reservation

from routes.auth import auth_bp
from routes.donation import donation_bp
from routes.reservation import reservation_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)

CORS(app)

app.config.from_object(Config)

db.init_app(app)
jwt.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(donation_bp, url_prefix="/api/donation")
app.register_blueprint(reservation_bp, url_prefix="/api/reservation")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

@app.route("/")
def home():
    return {
        "message": "FoodFlow Rescue Backend is Running!"
    }

if __name__ == "__main__":
    app.run(debug=True)