from flask import Blueprint, request, jsonify, redirect, url_for, render_template
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import db, User, Task

bp = Blueprint('routes', __name__)

@bp.route('/')
def home():
    if 'Authorization' in request.headers:
        return redirect(url_for('routes.handle_tasks'))
    return render_template('index.html')

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(username=data['username'])
    new_user.set_password(data['password']) 
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully!"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@bp.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def handle_tasks():
    current_user = get_jwt_identity()
    if request.method == 'GET':
        tasks = Task.query.filter_by(owner_id=current_user).all()
        return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'created_at': task.created_at} for task in tasks])
    
    if request.method == 'POST':
        data = request.json
        new_task = Task(title=data['title'], description=data.get('description'), owner_id=current_user)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'id': new_task.id}), 201

@bp.route('/tasks/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_task(id):
    current_user = get_jwt_identity()
    task = Task.query.filter_by(id=id, owner_id=current_user).first_or_404()

    if request.method == 'PUT':
        data = request.json
        task.title = data['title']
        task.description = data.get('description')
        db.session.commit()
        return jsonify({'id': task.id})

    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return '', 204
