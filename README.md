# 跨境电商手机支架选品分析平台

`cross-border-phone-holder-analyzer` 是一个用于暑期前端实习简历展示的前后端分离项目。

项目聚焦“手机支架”这个跨境电商轻小件品类，当前通过本地 `JSON` 文件模拟 Amazon 候选商品与 1688 货源数据，后续会围绕利润测算、竞争强度、物流成本、风险等级和推荐评分，逐步完成一个可用于作品展示和面试讲解的选品分析平台。

当前项目进度已完成到 **Day 3**：
- 前后端项目骨架已建立
- `products.json` 商品数据已录入
- `GET /api/health` 已完成
- `GET /api/products` 已完成

## 当前技术栈

- 前端：Vite + React + JavaScript
- 后端：Node.js + Express
- 模块规范：ES Module
- 数据存储：本地 JSON 文件

## 当前目录结构

```text
cross-border-phone-holder-analyzer/
├─ AGENTS.md
├─ README.md
├─ docs/
│  ├─ DAILY_LOG.md
│  ├─ DATA_MODEL.md
│  └─ PROJECT_PLAN.md
├─ client/
└─ server/
   ├─ app.js
   ├─ data/
   │  └─ products.json
   ├─ routes/
   │  └─ products.js
   ├─ package.json
   └─ package-lock.json
```

## 当前已完成内容

- 创建了前端 `client` 项目，使用 `Vite + React + JavaScript`
- 创建了后端 `server` 项目，使用 `Node.js + Express`
- 后端已切换为 `ES Module` 写法
- 已实现基础接口：
  - `GET /`
  - `GET /api/health`
  - `GET /api/products`
- 已实现未命中路由的 `404 JSON` 返回
- 已创建 `server/data/products.json`
- 已录入 12 条手机支架商品 mock 数据
- 已创建 `server/routes/products.js`，将商品列表接口拆分为独立路由模块
- 已补充 `docs/DATA_MODEL.md`，说明商品字段含义和后续用途

## 当前未完成内容

- `GET /api/products/:id`
- Dashboard 数据接口
- favorites 候选池接口
- 商品利润和推荐评分等计算逻辑
- 前端商品列表、详情页、分析页联调
- 搜索、筛选、排序功能

## 当前商品数据说明

- 当前商品数据使用项目内本地 `mock` 数据，不接真实 Amazon API、真实 1688 API，也不做真实爬虫
- 数据文件位置：`server/data/products.json`
- 当前数据条数：`12`
- 当前覆盖的手机支架类型包括：
  - 桌面手机支架
  - 车载手机支架
  - 折叠手机支架
  - 磁吸手机支架
  - 懒人手机支架
  - 直播手机支架
  - 铝合金手机支架
  - 平板/手机两用支架
  - 自行车/摩托车手机支架
  - 床头手机支架

## 当前可用接口

### `GET /`

用于快速确认后端服务已经启动。

### `GET /api/health`

健康检查接口，当前返回示例：

```json
{
  "status": "ok",
  "message": "Cross-border phone holder analyzer API is running,  gogogo!"
}
```

### `GET /api/products`

商品列表接口。

接口行为：
- 从 `server/data/products.json` 读取商品数据
- 返回完整商品数组
- 返回格式为 JSON
- 如果读取文件失败，返回 `500`
- 如果 `products.json` 内容不是数组，返回 `500`

正常返回示例：

```json
[
  {
    "id": 1,
    "productName": "示例商品",
    "category": "桌面手机支架"
  }
]
```

错误返回示例：

```json
{
  "status": "error",
  "message": "Failed to read products data.",
  "error": "具体错误信息"
}
```

## 如何启动前端

```bash
cd client
npm run dev
```

默认开发地址通常是：

```text
http://localhost:5173
```

## 如何启动后端

```bash
cd server
npm start
```

默认后端地址：

```text
http://localhost:3000
```

## 如何测试当前接口

测试健康检查接口：

```bash
curl.exe http://localhost:3000/api/health
```

测试商品列表接口：

```bash
curl.exe http://localhost:3000/api/products
```

也可以直接在浏览器访问：

```text
http://localhost:3000/api/products
```

## 如何检查 `products.json` 是否可被 Node 正常读取

```bash
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('server/data/products.json','utf8')); console.log(Array.isArray(data), data.length)"
```

如果能正常输出 `true 12`，说明当前 JSON 文件至少可以被 Node 正常读取，并且数据结构是数组。

## 当前最值得先理解的文件

- `server/app.js`
  - Express 服务入口、全局中间件、路由注册、404 处理
- `server/routes/products.js`
  - `GET /api/products` 的读取文件、解析 JSON、错误处理逻辑
- `server/data/products.json`
  - 当前项目的第一批商品 mock 数据
- `docs/DATA_MODEL.md`
  - 商品字段说明文档
- `docs/PROJECT_PLAN.md`
  - 每天要完成什么任务、每一步的验收标准
- `docs/DAILY_LOG.md`
  - 每日开发记录和阶段进度

## 当前状态说明

- 当前前端还不是完整业务页面，仍处于项目早期阶段
- 当前后端也不是完整业务 API，而是先从最小可运行接口逐步扩展
- 商品数据已经进入“可被接口读取”的阶段
- README 已同步到 Day 3 的真实状态
