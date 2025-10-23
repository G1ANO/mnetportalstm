from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, bcrypt
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to WiFi Portal"}), 200

if __name__ == '__main__':
    app.run(debug=True)



