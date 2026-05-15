# 跨境电商手机支架选品分析平台

## 项目简介

这是一个用于前端实习简历展示的前后端分离练习项目，聚焦“手机支架”这一跨境电商轻小件品类。

项目通过本地 JSON 数据模拟 Amazon 候选商品和 1688 货源信息，围绕利润、竞争、风险和推荐价值做基础分析，帮助卖家快速筛选更有潜力的商品。

## 当前阶段

当前处于 **Day 14：第二周复盘**。

这一阶段的重点不是新增功能，而是把第二周已经完成的前端基础页面和后端接口联调稳定下来，确保当前主流程可以正常运行。

目前已经完成的核心检查范围：

- React Router 主路由
- Dashboard 首页数据看板
- Products 商品列表页
- Product Detail 商品详情页
- 前端 `services/api.js` 请求封装
- 前后端基础联调
- 小范围样式整理

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- CSS

### 后端

- Node.js
- Express
- JSON 文件存储

### 数据来源

- `server/data/products.json`
- `server/data/favorites.json`

## 当前已完成内容

### 后端接口

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/dashboard`

### 前端页面

- `/`：Dashboard 数据看板页
- `/products`：商品列表页
- `/products/:id`：商品详情页
- `/analysis`：选品分析页占位
- `/favorites`：候选池页占位

### 已完成的前端主流程

- 已完成整体 Layout、Sidebar、Header
- 已完成 Sidebar 导航切换与当前项高亮
- 商品列表页直接请求 Node 后端 `GET /api/products`
- 商品详情页使用路由参数请求 `GET /api/products/:id`
- Dashboard 页直接请求 `GET /api/dashboard`
- 商品列表卡片支持跳转详情页
- 商品不存在和非法 id 已有错误状态

## 当前接口说明

### `GET /api/health`

用于检查后端服务是否正常运行。

### `GET /api/products`

返回商品列表数据，数据来自 `server/data/products.json`，并附带后端计算后的字段，例如：

- `platformFee`
- `profit`
- `profitRate`
- `profitRatePercent`
- `competitionLevel`
- `riskLevel`

### `GET /api/products/:id`

根据商品 `id` 返回单个商品详情。

- 合法且存在的商品 id 返回商品详情
- 不存在的商品 id 返回 `404`
- 非法商品 id 返回 `400`

### `GET /api/dashboard`

返回 Dashboard 首页所需的核心统计字段，包括：

- `totalProducts`
- `averageProfitRate`
- `averageProfitRatePercent`
- `highPotentialCount`
- `riskProductCount`
- `topProfitProducts`
- `categoryDistribution`
- `averageCompetitionScore`

## 本地运行方式

### 1. 启动后端

```bash
cd server
npm install
npm start
```

后端默认运行在 `http://localhost:3000`

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`

## 当前可直接访问的地址

### 后端接口

- [http://localhost:3000/api/health](http://localhost:3000/api/health)
- [http://localhost:3000/api/products](http://localhost:3000/api/products)
- [http://localhost:3000/api/products/1](http://localhost:3000/api/products/1)
- [http://localhost:3000/api/products/999](http://localhost:3000/api/products/999)
- [http://localhost:3000/api/products/abc](http://localhost:3000/api/products/abc)
- [http://localhost:3000/api/dashboard](http://localhost:3000/api/dashboard)

### 前端页面

- [http://localhost:5173/](http://localhost:5173/)
- [http://localhost:5173/products](http://localhost:5173/products)
- [http://localhost:5173/products/1](http://localhost:5173/products/1)
- [http://localhost:5173/products/999](http://localhost:5173/products/999)
- [http://localhost:5173/products/abc](http://localhost:5173/products/abc)
- [http://localhost:5173/analysis](http://localhost:5173/analysis)
- [http://localhost:5173/favorites](http://localhost:5173/favorites)

## 当前项目特点

- 不使用 TypeScript
- 不使用数据库
- 不接真实 Amazon API
- 不接真实 1688 API
- 不做真实爬虫
- 不做登录注册
- 不做 JWT 鉴权
- 不引入 Redux、Zustand 等复杂状态管理库
- 不引入复杂 UI 组件库

## 当前已知限制

- `AnalysisPage` 和 `FavoritesPage` 目前还是占位页，尚未进入真实业务实现阶段
- 商品图片路径已经预留，但当前主要依赖前端图片失败兜底展示
- 目前还没有搜索、筛选、排序、收藏、图表等第三周之后的功能

## 下一阶段计划

第三周会在当前稳定主流程的基础上，继续进入以下方向：

- 搜索功能
- 类目筛选
- 利润率筛选
- 商品排序
- 候选池功能
- 更完整的分析展示

## 项目说明

这个仓库当前更适合作为“学习型工程项目”的阶段性展示版本：

- 有清晰的前后端目录结构
- 有基础业务数据模型
- 有后端接口
- 有前端页面和路由
- 有前后端联调主流程
- 有每日开发记录，方便复盘和面试讲解
