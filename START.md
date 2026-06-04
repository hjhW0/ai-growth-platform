# 快速启动指南

## 第一步：配置后端

```bash
# 进入后端目录
cd backend

# 安装 Python 依赖
pip install -r requirements.txt

# 复制环境变量配置文件
cp .env.example .env

# 编辑 .env 文件，配置 AI 选项
# 方案1：使用本地 Ollama（免费）
USE_LOCAL_AI=true

# 方案2：使用 DeepSeek API
USE_LOCAL_AI=false
DEEPSEEK_API_KEY=你的API Key
```

## 第二步：配置前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

## 第三步：启动项目

### 方式1：使用启动脚本（Windows）
```bash
# 双击 start.bat 文件
```

### 方式2：手动启动

**启动后端：**
```bash
cd backend
python app.py
```

**启动前端（新终端）：**
```bash
cd frontend
npm start
```

## 第四步：访问应用

打开浏览器访问：http://localhost:3000

## 功能测试

1. **首页 Dashboard**
   - 查看今日任务
   - 查看统计数据

2. **目标管理**
   - 创建新目标
   - 查看目标列表

3. **任务管理**
   - 添加每日任务
   - 完成任务

4. **打卡系统**
   - 每日打卡
   - 查看连续打卡天数

5. **AI 中心**
   - AI 规划师：输入目标，生成学习计划
   - AI 复盘：输入今日完成任务，生成复盘总结
   - AI 周报：生成每周成长报告
   - AI 对话：与 AI 教练聊天

## 常见问题

### 1. 后端启动失败
- 检查 Python 版本（建议 3.8+）
- 检查依赖是否安装完整：`pip install -r requirements.txt`

### 2. 前端启动失败
- 检查 Node.js 版本（建议 16+）
- 清除缓存：`npm cache clean --force`
- 重新安装：`rm -rf node_modules && npm install`

### 3. AI 功能不工作
- 如果使用 Ollama：确保 Ollama 已启动，模型已下载
- 如果使用 DeepSeek API：检查 API Key 是否正确

## 下一步

- [ ] 完善 UI 样式
- [ ] 添加用户登录状态保持
- [ ] 添加数据可视化图表
- [ ] 实现成就徽章系统
