import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_jwt_extended import JWTManager
from models import db, User, Task
from routes import bp as routes_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

admin = Admin(app, name='My Admin', template_mode='bootstrap3')
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Task, db.session))
app.register_blueprint(routes_bp)

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"msg": "Missing Authorization Header"}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
            
    app.run(host='0.0.0.0', debug=True)
