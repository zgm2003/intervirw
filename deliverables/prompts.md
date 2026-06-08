# 英语盲盒面试题 Prompt 记录

## 原始 Prompt

你是一名中高级全栈工程师。请根据“英语课堂互动盲盒”上机题完成交付：

1. 使用 Node.js Express 搭建 RESTful API 服务，端口 3000，启用 CORS。
2. API 必须包含：
   - GET /api/boxes：获取所有盲盒列表
   - POST /api/boxes：创建盲盒，入参 content、image
   - PUT /api/boxes/:id：更新盲盒内容
   - DELETE /api/boxes/:id：删除盲盒
   - POST /api/draw：随机抽取一个未被抽取过的盲盒并标记为已抽取
3. 修改现有 index.html 内 script：
   - 页面加载时通过 GET /api/boxes 获取并渲染
   - 点击保存时同步更新后端
   - 点击开始抽取后使用 POST /api/draw 获取抽取结果
4. 保留 UI，不重写页面结构。
5. 提供可运行代码、测试、运行说明。

## 迭代优化 Prompt 1

请不要重写整个 HTML，只定位现有 state/render 入口，把新增、保存、删除、抽取这些状态变更接入 REST API。现有 UI、CSS、页面结构保持兼容。

## 迭代优化 Prompt 2

请先检查现有 JavaScript 的根因问题，尤其是未定义变量、内存状态与后端状态不一致的问题。修复时不要增加无意义兜底，后端返回不存在的盲盒应报错提示。

## 迭代优化 Prompt 3

请补充自动化测试：验证 boxes CRUD、draw 抽取状态、前端 HTML 是否包含 API 集成函数、页面初始化是否从后端加载数据，并确认测试通过。

## 迭代优化 Prompt 4

请整理面试交付物：修改后的 index.html、后端服务源码、package.json、测试文件、运行说明、Prompt 文本与截图形式的记录。
