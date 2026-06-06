#!/bin/bash
# 初始化 Flask-Migrate 数据库迁移
# 在项目根目录运行：docker exec -it ai-growth-backend bash /app/backend/init-migrations.sh

cd /app/backend

echo "=== 初始化迁移仓库 ==="
flask db init

echo "=== 生成初始迁移 ==="
flask db migrate -m "init: all tables"

echo "=== 应用迁移 ==="
flask db upgrade

echo "=== 完成 ==="
echo "迁移文件已创建在 backend/migrations/ 目录"
