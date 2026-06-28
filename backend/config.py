from datetime import timedelta
class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:khandjot_2005@localhost/food_rescue"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "supersecretkey"

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)