# AI 成长助手 - 系统架构

## 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      用户浏览器                              │
│                    http://localhost:3000                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   React 前端应用                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Dashboard│ │  Goals  │ │  Tasks  │ │ AI Chat │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       └───────────┴───────────┴───────────┘                 │
│                           │                                 │
│                    apiClient.js                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Flask 后端服务                             │
│                    http://localhost:5000                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │auth.py  │ │tasks.py │ │ ai.py   │                       │
│  └────┬────┘ └────┬────┘ └────┬────┘                       │
│       └───────────┴───────────┘                             │
│                           │                                 │
│  ┌─────────────────────────────────────────┐               │
│  │              Models 层                   │               │
│  │  ┌─────────┐       ┌─────────┐          │               │
│  │  │ user.py │       │ task.py │          │               │
│  │  └────┬────┘       └────┬────┘          │               │
│  └───────┴─────────────────┴───────────────┘               │
│                           │                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌───────────────────────┐    ┌───────────────────────┐
│    SQLite 数据库       │    │     AI 服务            │
│ growth_assistant.db   │    │  ┌─────────────────┐  │
│                       │    │  │ DeepSeek API    │  │
│ - users               │    │  │ 或               │  │
│ - goals               │    │  │ Ollama 本地模型  │  │
│ - daily_tasks         │    │  └─────────────────┘  │
│ - ai_chats            │    │                       │
│ - growth_logs         │    └───────────────────────┘
└───────────────────────┘
```

## 数据流

### 1. 用户注册/登录流程
```
用户输入 → 前端表单 → POST /api/auth/register → 后端验证 → 密码哈希 → 存入 users 表 → 返回用户信息
```

### 2. 目标管理流程
```
创建目标 → 前端表单 → POST /api/tasks/goals → 后端处理 → 存入 goals 表 → 返回目标列表
```

### 3. 每日任务流程
```
添加任务 → 前端输入 → POST /api/tasks/daily → 存入 daily_tasks 表 → 返回任务列表
完成任务 → 点击复选框 → POST /api/tasks/daily/:id/complete → 更新 is_completed 字段
```

### 4. AI 交互流程
```
用户输入目标 → 前端发送 → POST /api/ai/plan → 后端构建 Prompt → 调用 AI 服务 → 返回学习计划
                                                                        ↓
                                                          DeepSeek API 或 Ollama
```

## 核心模块说明

### 前端模块

| 模块 | 功能 |
|------|------|
| Dashboard.js | 仪表盘，展示统计数据和今日任务 |
| GoalManager.js | 目标管理，创建和查看目标 |
| DailyTasks.js | 每日任务，添加、完成、查看任务 |
| AIChat.js | AI 助手，对话、学习计划、每日复盘 |
| apiClient.js | API 调用封装，统一处理后端请求 |

### 后端模块

| 模块 | 功能 |
|------|------|
| app.py | Flask 主入口，注册蓝图 |
| routes/auth.py | 用户认证接口 |
| routes/tasks.py | 任务和目标管理接口 |
| routes/ai.py | AI 功能接口 |
| models/user.py | 用户数据模型 |
| models/task.py | 任务和目标数据模型 |
| utils/db.py | 数据库初始化和连接 |
| utils/ai_client.py | AI 服务调用封装 |

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | TEXT | 用户名，唯一 |
| password_hash | TEXT | 密码哈希 |
| created_at | TIMESTAMP | 创建时间 |

### goals 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 外键，关联 users |
| title | TEXT | 目标标题 |
| description | TEXT | 目标描述 |
| goal_type | TEXT | 目标类型 |
| deadline | DATE | 截止日期 |
| status | TEXT | 状态 (active/completed/paused) |
| created_at | TIMESTAMP | 创建时间 |

### daily_tasks 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 外键，关联 users |
| goal_id | INTEGER | 外键，关联 goals |
| title | TEXT | 任务标题 |
| description | TEXT | 任务描述 |
| task_date | DATE | 任务日期 |
| is_completed | BOOLEAN | 是否完成 |
| completed_at | TIMESTAMP | 完成时间 |
| created_at | TIMESTAMP | 创建时间 |

### ai_chats 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 外键，关联 users |
| message | TEXT | 用户消息 |
| response | TEXT | AI 回复 |
| chat_type | TEXT | 对话类型 (plan/review/advice/chat) |
| created_at | TIMESTAMP | 创建时间 |
