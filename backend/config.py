import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """应用配置"""
    # 基础配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # 数据库配置
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///growth_platform.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT 配置
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 小时

    # AI 配置
    USE_LOCAL_AI = os.getenv('USE_LOCAL_AI', 'false').lower() == 'true'
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')
    DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
    OLLAMA_BASE = os.getenv('OLLAMA_URL', 'http://localhost:11434')
    MODEL_CHAT = os.getenv('MODEL_CHAT', 'qwen3:8b')
    MODEL_REASONING = os.getenv('MODEL_REASONING', 'deepseek-r1:8b')
