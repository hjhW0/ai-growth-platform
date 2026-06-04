import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from extensions import db, jwt, migrate


def create_app():
    """Flask 应用工厂"""
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
    app.config.from_object(Config)
    CORS(app)

    # 初始化扩展
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # 导入模型（确保表被创建）
    import models  # noqa: F401

    # 注册蓝图
    from routes.auth import auth_bp
    from routes.goals import goals_bp
    from routes.tasks import tasks_bp
    from routes.checkin import checkin_bp
    from routes.stats import stats_bp
    from routes.ai import ai_bp
    from routes.feedback import feedback_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(checkin_bp, url_prefix='/api/checkin')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')

    # 前端路由
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def static_proxy(path):
        file_path = os.path.join(app.static_folder, path)
        if os.path.isfile(file_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app


# 生产环境直接创建 app
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)
