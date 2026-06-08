# 英语盲盒全栈面试题交付说明

## 环境要求

- Node.js 18+（当前环境已验证 Node.js v24.0.1）
- npm

## 安装依赖

```bash
npm install
```

## 启动服务

```bash
npm start
```

服务地址：

- 页面：http://localhost:3000/
- API：http://localhost:3000/api/boxes

## 运行测试

```bash
npm test
```

## API 清单

- GET `/api/boxes`：获取所有盲盒
- POST `/api/boxes`：创建盲盒
- PUT `/api/boxes/:id`：更新盲盒
- DELETE `/api/boxes/:id`：删除盲盒
- POST `/api/draw`：随机抽取未抽取盲盒并标记 drawn
- POST `/api/draw/reset`：重新开始前重置抽取状态

## 文件说明

- `index.html`：最终修改后的前端页面
- `server.js`：Express 后端服务
- `package.json`：依赖和脚本
- `tests/api.test.js`：后端 API 测试
- `tests/frontend-static.test.js`：前端 API 集成静态测试
- `images/`：盲盒封面图片资源
- `deliverables/prompts.md`：原始 Prompt 和迭代优化 Prompt 文本
- `deliverables/prompts-screenshot.png`：Prompt 截图形式记录
- `deliverables/ai-first-generation/`：AI 首次生成代码快照
- `deliverables/final-source/`：最终源码快照
