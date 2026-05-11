# 跨境电商手机支架选品分析平台

`cross-border-phone-holder-analyzer` 是一个面向前端暑期实习投递的前后端分离项目。项目聚焦手机支架这个跨境电商轻小件品类，后续会通过 Amazon 候选商品与 1688 货源数据对比，分析利润率、物流成本、竞争强度、评分风险和推荐指数。

当前处于 Day 2 完成状态：项目脚手架、基础页面、后端最小接口、文档体系和第一批商品 `mock` 数据已经建立，后续会继续围绕这些数据实现商品接口、筛选排序、Dashboard 和选品分析功能。

## 当前技术栈
- 前端：`Vite + React + JavaScript`
- 后端：`Node.js + Express`
- 后端模块规范：`ES Module`
- 数据存储：当前使用本地 `JSON` 文件

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
   └─ data/
      └─ products.json
```

## 当前已完成内容
- 创建前端 `client`，使用 `Vite + React + JavaScript` 初始化。
- 创建后端 `server`，安装 `express` 和 `cors`。
- 后端已切换为 `ES Module` 写法。
- 已实现基础路由：
  - `GET /`
  - `GET /api/health`
- 已实现未命中路由的 `404 JSON` 返回。
- 前端已替换默认 Vite 演示页，改为项目介绍型首页。
- 已创建 `server/data/products.json`。
- 已录入 12 条手机支架商品 `mock` 数据。
- 已补充 `docs/DATA_MODEL.md`，说明商品字段含义和后续用途。

## 当前未完成内容
- 商品列表接口
- 商品详情接口
- Dashboard 数据接口
- 前后端联调
- 商品利润和推荐评分等计算逻辑

## 当前商品数据说明
- 当前商品数据是项目内的 `mock` 数据，不是来自真实 Amazon API、真实 1688 API 或真实爬虫。
- 这样设计是为了先完成前后端分离项目的核心业务流程，并且符合当前项目“不接真实 API、不做真实爬虫”的开发边界。
- 这批数据不是随意乱写，而是按手机支架常见价格带、重量、体积、销量、评分和竞争情况做的模拟建模。
- 目前数据文件位置：`server/data/products.json`
- 当前数据条数：`12`
- 当前覆盖类型包括：
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

## 这些数据后续会用在哪里
- 商品列表页展示商品名称、价格、标签、评分和图片
- 商品详情页展示成本、物流、材质、风险因素和推荐理由
- 搜索和筛选功能使用 `productName`、`category`、`tags`
- 排序功能使用 `rating`、`estimatedMonthlySales`、`competitionScore`
- Dashboard 统计会使用 `category`、`estimatedMonthlySales`、`competitionScore`
- 利润分析会使用 `amazonPrice`、`cost1688`、`shippingCost`、`platformFeeRate`

## 后续是否可以升级为真实平台
- 可以逐步升级，但不是只把 `JSON` 换成数据库就够了。
- 当前这一步先解决“数据结构怎么设计、页面和接口怎么跑通”。
- 后续如果要升级，可以先从 `JSON -> 数据库` 迁移，再补真实数据来源、数据更新机制和更完整的业务规则。
- 也就是说，当前数据模型是为了后续扩展做准备的，不是一次性写死的临时结构。

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

## 当前可用接口

### `GET /`
用于快速确认后端服务已经启动。

### `GET /api/health`
健康检查接口，返回：

```json
{
  "status": "ok",
  "message": "Cross-border phone holder analyzer API is running"
}
```

## 如何测试 `/api/health`
```bash
curl.exe http://localhost:3000/api/health
```

## 如何检查 `products.json` 是否正确
```bash
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('server/data/products.json','utf8')); console.log(data.length)"
```

如果能正常输出 `12`，说明当前 JSON 至少可以被 Node 正常读取。

## 当前最值得先理解的文件
- `client/src/main.jsx`
  - React 应用入口，负责把 `App` 挂到页面上。
- `client/src/App.jsx`
  - 当前首页内容和页面结构。
- `client/src/index.css`
  - 全局样式变量、基础排版和整体背景。
- `client/src/App.css`
  - 首页的布局、卡片、响应式和动效样式。
- `server/app.js`
  - Express 服务入口、路由注册、中间件配置。
- `server/data/products.json`
  - 当前项目的第一批商品 `mock` 数据，后续接口会从这里读取商品信息。
- `docs/DATA_MODEL.md`
  - 商品字段说明文档，适合理解为什么要这样设计商品数据结构。
- `client/package.json`
  - 前端依赖和启动脚本。
- `server/package.json`
  - 后端依赖、启动脚本和模块类型配置。

## 当前状态说明
- 前端不是数据平台成品，而是项目早期阶段的介绍页。
- 后端不是完整业务 API，而是当前阶段的最小可运行服务。
- 商品数据已经进入建模阶段，但接口和页面还没有开始消费这些数据。
- 根目录文档已按当前真实状态同步。
