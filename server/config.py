import os

class Config:
    # Use environment variables for production, fallback to development defaults
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-in-production'

    # Database configuration
    # In production (Render), DATABASE_URL will be set automatically for PostgreSQL
    # In development, it falls back to SQLite
    database_url = os.environ.get('DATABASE_URL')

    # Render provides DATABASE_URL starting with 'postgres://' but SQLAlchemy 1.4+ requires 'postgresql://'
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    SQLALCHEMY_DATABASE_URI = database_url or 'sqlite:///wifi_portal.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS configuration - will be set in app.py based on environment
    FRONTEND_URL = os.environ.get('FRONTEND_URL') or 'http://localhost:5173'
