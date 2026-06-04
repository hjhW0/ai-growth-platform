from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    if len(password) < 6:
        return jsonify({'error': '密码长度不能少于6位'}), 400

    # 检查用户名是否已存在
    existing = User.query.filter_by(username=username, is_deleted=False).first()
    if existing:
        return jsonify({'error': '用户名已存在'}), 409

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': '注册成功',
        'user': user.to_dict(),
        'access_token': access_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    user = User.query.filter_by(username=username, is_deleted=False).first()

    if not user or not user.check_password(password):
        return jsonify({'error': '用户名或密码错误'}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': '登录成功',
        'user': user.to_dict(),
        'access_token': access_token
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """获取当前用户信息"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': '用户不存在'}), 404

    return jsonify({'user': user.to_dict()})
