# AI 成长平台

基于大语言模型的个人成长与学习规划平台

## 核心功能

- 🎯 **目标管理** - 设定长期和短期目标
- ✅ **每日任务** - 管理每日待办事项
- 🔥 **打卡系统** - 每日打卡，连续打卡记录
- 📊 **数据统计** - 完成率趋势、学习时长统计
- 🤖 **AI 中心** - AI 规划师、AI 复盘、AI 周报、AI 对话

## 技术栈

- **前端**: React 18 + React Router + Recharts
- **后端**: Python Flask + SQLite
- **AI**: DeepSeek API / Ollama 本地部署

## 快速开始

### 1. 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（复制 .env.example 为 .env）
cp .env.example .env
# 编辑 .env 文件，填入你的 DeepSeek API Key

# 启动后端服务
python app.py
```

### 2. 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm start
```

### 3. 访问应用

打开浏览器访问 http://localhost:3000

## AI 配置

### 方案1：使用 DeepSeek API

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号
2. 创建 API Key
3. 在 `.env` 文件中配置：
   ```
   USE_LOCAL_AI=false
   DEEPSEEK_API_KEY=你的API Key
   ```

### 方案2：使用本地 Ollama（推荐，免费）

1. 安装 [Ollama](https://ollama.ai/)
2. 拉取模型：
   ```bash
   ollama pull deepseek-r1:8b
   ```
3. 在 `.env` 文件中配置：
   ```
   USE_LOCAL_AI=true
   ```

## 项目结构

```
ai-growth-platform/
├─ backend/                    # 后端服务
│   ├─ app.py                  # Flask 主入口
│   ├─ routes/                 # API 路由
│   │   ├─ auth.py             # 用户认证
│   │   ├─ tasks.py            # 任务管理
│   │   ├─ goals.py            # 目标管理
│   │   ├─ checkin.py          # 打卡系统
│   │   ├─ stats.py            # 数据统计
│   │   └─ ai.py               # AI 接口
│   ├─ models/                 # 数据模型
│   ├─ utils/                  # 工具函数
│   └─ requirements.txt        # Python 依赖
│
├─ frontend/                   # 前端项目
│   ├─ public/                 # 静态资源
│   ├─ src/                    # 源代码
│   │   ├─ pages/              # 页面组件
│   │   │   ├─ Dashboard.js    # 首页仪表盘
│   │   │   ├─ Goals.js        # 目标管理
│   │   │   ├─ Tasks.js        # 任务管理
│   │   │   ├─ CheckIn.js      # 打卡系统
│   │   │   ├─ Stats.js        # 数据统计
│   │   │   └─ AICenter.js     # AI 中心
│   │   ├─ api/                # API 调用封装
│   │   └─ utils/              # 工具函数
│   └─ package.json            # 前端依赖
│
├─ database/                   # 数据库文件
└─ README.md
```

## API 接口

### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 目标管理
- `POST /api/goals/` - 创建目标
- `GET /api/goals/:userId` - 获取用户目标

### 每日任务
- `POST /api/tasks/daily` - 创建任务
- `GET /api/tasks/daily/:userId` - 获取每日任务
- `POST /api/tasks/daily/:taskId/complete` - 完成任务

### 打卡系统
- `POST /api/checkin/` - 每日打卡
- `GET /api/checkin/:userId` - 获取打卡状态
- `GET /api/checkin/streak/:userId` - 获取连续打卡天数

### 数据统计
- `GET /api/stats/today/:userId` - 今日统计
- `GET /api/stats/week/:userId` - 本周统计
- `GET /api/stats/month/:userId` - 本月统计

### AI 功能
- `POST /api/ai/plan` - AI 生成学习计划
- `POST /api/ai/review` - AI 每日复盘
- `POST /api/ai/advice` - AI 成长建议
- `POST /api/ai/weekly-report` - AI 周报告
- `POST /api/ai/chat` - AI 对话

## 开发计划

- [x] 用户系统
- [x] 目标管理
- [x] 任务管理
- [x] 打卡系统
- [x] 数据统计
- [x] AI 规划师
- [x] AI 复盘
- [x] AI 周报
- [ ] AI 教练
- [ ] 成就徽章
- [ ] 桌宠
- [ ] 手机端

## License

MIT
