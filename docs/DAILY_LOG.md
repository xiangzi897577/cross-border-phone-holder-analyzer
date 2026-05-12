# DAILY_LOG

## Day 1 - 2026-05-11

### 今日目标
- 完成项目初始化
- 完成前后端基础脚手架
- 完成后端健康检查接口
- 建立项目文档体系

### 已完成
- 创建了 `client` 前端目录，并使用 `Vite + React + JavaScript` 初始化。
- 安装了前端依赖，确认前端可以正常启动和构建。
- 创建了 `server` 后端目录，并初始化 Node.js 项目。
- 安装了 `express` 和 `cors`。
- 创建了 `server/app.js`，实现基础服务入口。
- 实现了 `GET /api/health` 健康检查接口。
- 补充了 `GET /` 根路径提示和未命中路由的 `404 JSON` 返回。
- 将后端模块写法调整为 `ES Module`。
- 将前端默认 Vite 演示页替换为项目介绍型首页。
- 创建并更新了 `AGENTS.md`、`README.md`、`docs/PROJECT_PLAN.md`、`docs/DAILY_LOG.md`。

### 本次复查结果
- `client` 执行 `npm run build` 通过。
- `server` 启动后，`GET /api/health` 返回正确 JSON。
- 当前目录结构和 Day 1 目标一致。
- 文档已同步为当前真实状态。

### 关键决策
- 前端继续使用 `JavaScript`，不引入 TypeScript。
- 后端保留 `Express` 最小结构，先不引入数据库。
- 后端改用 `ES Module`，与前端的 `import/export` 风格保持一致。
- 当前只保留基础接口，不提前进入商品业务开发。

### 当前可用内容
- 前端项目介绍页
- 后端基础服务
- 健康检查接口
- 文档体系

### 下一步
- 设计商品 mock 数据结构
- 设计分析指标字段
- 开始进入第一个真实业务接口开发
### Day 1 收尾补充
- 已在项目根目录完成 Git 初始化，当前项目已经成为 Git 仓库。
- 已完成 GitHub 空仓库的远程关联，远程仓库连接正常。
- 已完成首次 commit 与首次 push，当前项目代码已经成功同步到 GitHub。
- 今日 Day 1 任务圆满完成，可以作为 Day 2 开发的稳定起点。

## Day 2 - 2026-05-11

### 今日完成内容
- 创建了 `server/data` 目录。
- 创建了 `server/data/products.json`。
- 设计了手机支架商品统一数据模型，包含价格、成本、物流、销量、竞争、风险和推荐理由等核心字段。
- 写入了 12 条首批手机支架商品数据，覆盖桌面、车载、折叠、磁吸、懒人、直播、铝合金、平板/手机两用、自行车/摩托车、床头等类型。
- 创建了 `docs/DATA_MODEL.md`，补充商品数据字段说明和后续用途。

### 修改了哪些文件
- `server/data/products.json`
- `docs/DATA_MODEL.md`
- `docs/DAILY_LOG.md`

### 是否成功创建 products.json
- 是，已成功创建，并可继续用于后续 Node 文件读取。

### 商品数据条数
- 12 条

### 今日重点理解内容
- 如何用 JSON 设计统一的商品数据结构。
- 如何让一个字段同时服务列表页、详情页、筛选、排序和图表统计。
- 如何提前为利润率、平台手续费、竞争强度和风险分析准备基础数据。
- 为什么要在建模阶段统一字段名称、类型和单位。

### 明日任务
- 实现 `GET /api/products` 接口。

## Day 3 - 2026-05-11

### 今日完成内容
- 创建了 `server/routes` 目录。
- 创建了 `server/routes/products.js`，把商品列表接口单独拆到路由文件中。
- 实现了 `GET /api/products`，从 `server/data/products.json` 读取商品数据并返回完整数组。
- 为商品数据读取增加了两类错误处理：
  - 读取或解析文件失败时返回 `500`
  - `products.json` 不是数组时返回 `500`
- 在 `server/app.js` 中注册了 `/api/products` 路由，同时保留原有 `GET /api/health` 接口。

### 修改了哪些文件
- `server/app.js`
- `server/routes/products.js`
- `docs/DAILY_LOG.md`

### 是否成功创建 GET /api/products 接口
- 是，已经完成 `GET /api/products` 接口的代码实现。

### 如何测试该接口
- 进入 `server` 目录后运行 `node app.js`
- 浏览器访问 `http://localhost:3000/api/products`
- 或终端执行 `curl http://localhost:3000/api/products`
- 正常情况下应返回 `products.json` 中的商品数组，返回格式为 JSON

### 今日重点理解内容
- `express.Router()` 的作用：把商品相关接口从 `app.js` 中拆出去，保持入口文件清晰。
- `app.use('/api/products', productsRouter)` 的作用：把路由模块挂载到指定接口前缀。
- `fs/promises` 中 `readFile` 的作用：异步读取本地 JSON 文件。
products.js 是商品接口的“分店”；app.js 是后端总入口。

浏览器访问 /api/products
↓
Express 接收到请求
↓
进入 routes/products.js
↓
读取 server/data/products.json
↓
把商品数组通过 res.json 返回
↓
浏览器看到 JSON 商品数据

import { readFile } from 'fs/promises'
这个是 Node 自带的文件读取工具。
fs 是 file system，意思是文件系统。
readFile 的作用是：
读取本地文件内容server/data/products.json


import { fileURLToPath } from 'url'
const currentFilePath = fileURLToPath(import.meta.url)
来自己算出当前文件路径。

商品列表、商品详情、商品搜索、商品筛选，以后都可以慢慢放在 products.js 里面。
- 为什么要先 `JSON.parse()` 再用 `Array.isArray()` 校验数据结构。
- 为什么接口需要统一返回 JSON，并在出错时返回明确的状态码和错误信息。

### 明日任务
- 实现 `GET /api/products/:id` 商品详情接口。

## Day 4 - 2026-05-12

### 今日完成内容
- 在 `server/routes/products.js` 中新增了 `GET /api/products/:id` 商品详情接口。
- 继续使用 `server/data/products.json` 作为商品数据来源，没有修改商品数据结构。
- 增加了 `id` 参数校验：当 `id` 不是合法数字时返回 `400`。
- 增加了商品不存在处理：当找不到对应商品时返回 `404`。
- 保持原有 `GET /api/products` 商品列表接口继续可用。

### 修改了哪些文件
- `server/routes/products.js`
- `docs/DAILY_LOG.md`

### 是否成功创建 GET /api/products/:id 接口
- 是，已经成功创建 `GET /api/products/:id` 接口。

### 如何测试该接口
- 进入 `server` 目录后运行 `node app.js`
- 浏览器访问 `http://localhost:3000/api/products/1`
- 浏览器访问 `http://localhost:3000/api/products/2`
- 浏览器访问 `http://localhost:3000/api/products/999`
- 浏览器访问 `http://localhost:3000/api/products/abc`
- 或在终端执行：
  - `curl http://localhost:3000/api/products/1`
  - `curl http://localhost:3000/api/products/2`
  - `curl http://localhost:3000/api/products/999`
  - `curl http://localhost:3000/api/products/abc`

### 商品不存在时如何处理
- 先用 `find()` 根据数字 `id` 查找商品。
- 如果没有找到对应商品，就返回 `404` 状态码和错误信息 `Product not found.`。

### id 不合法时如何处理
- 先从 `req.params.id` 取出路由参数。
- 再用 `Number()` 转成数字。
- 如果结果不是合法整数，就返回 `400` 状态码和错误信息 `Product id must be a valid number.`。

### 今日重点理解内容
- `router.get('/:id')` 如何在路由模块中匹配动态路径参数。
- `req.params.id` 是如何拿到 URL 中的 `id` 的。
- 为什么 JSON 文件读取后要先 `JSON.parse()`，再用 `Array.isArray()` 校验数据结构。
- 为什么商品 `id` 需要先转成数字，再和 `products.json` 中的数字类型 `id` 做严格比较。
- `find()` 是如何从数组中查找第一个满足条件的商品对象的。
- `400`、`404`、`500` 三种状态码在接口错误处理中的区别。

### 明日任务
- 实现商品利润计算工具函数。
