# backend/auth.py
from authx import AuthX, AuthXConfig
import os
from dotenv import load_dotenv

load_dotenv()

config = AuthXConfig()
config.JWT_SECRET_KEY = os.getenv("Secret_Key")
config.JWT_ACCESS_COOKIE_NAME = "my_access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]
config.JWT_COOKIE_CSRF_PROTECT = False
config.JWT_COOKIE_SAMESITE = "none"
config.JWT_COOKIE_SECURE = False  # True только на HTTPS

security = AuthX(config=config)