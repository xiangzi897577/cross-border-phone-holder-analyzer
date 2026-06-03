# 跨境电商手机支架选品分析平台

## 项目简介

这是一个用于前端实习简历展示的前后端分离项目，聚焦“手机支架”这一跨境电商轻小件品类。

项目通过本地 mock 数据模拟 Amazon 候选商品与 1688 货源信息，围绕利润测算、竞争强度、物流成本、风险等级、推荐评分、候选池管理和图表分析，帮助跨境电商卖家快速筛选更值得跟进的商品。

当前版本已经完成 mock 数据阶段的核心业务闭环，包括商品列表、商品详情、Dashboard 数据看板、选品分析、候选池管理、推荐评分和风险分析等功能。

后续阶段将重点进行 UI 优化、商品图片补齐、部署上线、README 截图、简历描述和面试讲解准备。数据库、真实 1688 / Amazon API、UI 组件库等能力不再作为绝对限制，而是根据后续明确任务逐步扩展。

---

## 在线预览

> 部署完成后补充以下地址。

* 前端预览地址：待补充
* 后端接口地址：待补充
* GitHub 仓库地址：待补充

---

## 技术栈

### 前端

* React
* Vite
* JavaScript
* React Router
* Recharts
* CSS

### 后端

* Node.js
* Express
* JSON 文件模拟数据存储

### 当前数据来源

* `server/data/products.json`
* `server/data/favorites.json`

### 后续可扩展方向

后续如果有明确任务，可以逐步扩展：

* 数据库：MySQL / PostgreSQL / SQLite / MongoDB
* ORM：Prisma 等
* UI 组件库：Ant Design / Material UI / 其他组件库
* 真实数据源：1688 API / Amazon API
* 部署平台：Vercel / Render / Railway / Koyeb
* 图片数据：本地 mock 图片 / 1688 货源图片 / 图片缓存

---

## 核心功能

### Dashboard 数据看板

* 展示商品总数、平均利润率、高潜力商品数和风险商品数。
* 展示利润率排行柱状图。
* 展示手机支架类型分布饼图。
* 数据来自后端 `GET /api/dashboard`。

### 商品列表

* 展示手机支架商品卡片。
* 支持关键词搜索。
* 支持类目筛选。
* 支持最低利润率筛选。
* 支持按利润率、月销量、评分、竞争指数和推荐评分排序。
* 支持从商品卡片加入候选池。

### 商品详情

* 根据路由参数请求单个商品详情。
* 展示商品基础信息、价格成本、利润、市场指标、竞争等级、风险等级和推荐评分。
* 展示风险原因标签。
* 支持加入候选池。
* 支持商品不存在和非法 id 的错误状态。

### 选品分析

* 展示高潜力商品。
* 展示高风险商品。
* 展示低竞争高利润商品。
* 高风险商品展示风险原因标签。
* 使用利润率、竞争指数、风险等级、风险因素数量和推荐评分进行分组分析。

### 候选池

* 使用 `server/data/favorites.json` 保存候选商品 id。
* 支持获取候选池商品。
* 支持添加商品到候选池。
* 支持从候选池取消收藏。
* 支持从候选池进入商品详情页。

---

## 后端接口

### `GET /api/health`

用于检查后端服务是否正常运行。

### `GET /api/products`

返回商品列表数据，并附带后端计算字段。

支持查询参数：

* `keyword`：按商品名称、类目、标签搜索。
* `category`：按手机支架类目筛选。
* `minProfitRate`：按最低利润率百分比筛选。
* `sort`：按指定方式排序。

支持排序方式：

* `profitRateDesc`：利润率从高到低。
* `monthlySalesDesc`：月销量从高到低。
* `ratingDesc`：评分从高到低。
* `competitionScoreAsc`：竞争指数从低到高。
* `recommendationScoreDesc`：推荐评分从高到低。

### `GET /api/products/:id`

根据商品 `id` 返回单个商品详情。

* 合法且存在的商品 id 返回商品详情。
* 不存在的商品 id 返回 `404`。
* 非法商品 id 返回 `400`。

### `GET /api/dashboard`

返回 Dashboard 首页统计数据。

主要字段：

* `totalProducts`
* `averageProfitRate`
* `averageProfitRatePercent`
* `highPotentialCount`
* `riskProductCount`
* `topProfitProducts`
* `categoryDistribution`
* `averageCompetitionScore`
* `lowCompetitionHighProfitCount`

### `GET /api/favorites`

返回候选池商品列表。

### `POST /api/favorites`

添加商品到候选池。

请求体示例：

```json
{
  "productId": 1
}
```

### `DELETE /api/favorites/:id`

根据商品 id 从候选池删除商品。

---

## 核心计算字段

后端通过 `server/utils/productMetrics.js` 为商品补充计算字段：

* `revenueCNY`：预估人民币销售收入。
* `platformFee`：平台手续费。
* `totalCost`：总成本。
* `profit`：单件利润。
* `profitRate`：利润率小数值。
* `profitRatePercent`：利润率百分比。
* `competitionLevel`：竞争等级。
* `riskFactors`：风险原因数组。
* `riskLevel`：风险等级。
* `recommendationScore`：推荐评分。

---

## 利润计算逻辑

核心利润测算逻辑：

```txt
收入 revenueCNY = amazonPrice × 汇率
平台手续费 platformFee = revenueCNY × platformFeeRate
总成本 totalCost = 1688 成本 + 物流成本 + 平台手续费
利润 profit = revenueCNY - totalCost
利润率 profitRate = profit / totalCost
利润率百分比 profitRatePercent = profitRate × 100
```

该逻辑用于商品列表、商品详情、Dashboard 和选品分析页。

---

## 推荐评分规则

`recommendationScore` 是一个 `0-100` 的综合分数，主要考虑：

* 利润率
* 预估月销量
* 商品评分
* 竞争指数
* 物流成本
* 重量和体积等级

评分思路：

* 利润率越高，加分越多。
* 月销量越高，加分越多。
* 商品评分越高，加分越多。
* 竞争指数越低，加分越多。
* 物流成本越低，加分越多。
* 重量越轻、体积越小，加分越多。

该评分用于选品分析页的高潜力商品排序，也可以用于商品列表中的推荐评分排序。

---

## 风险分析规则

`riskFactors` 会根据以下规则生成：

* `profitRatePercent < 20`：利润率过低。
* `competitionScore >= 70`：竞争指数过高。
* `rating < 4.2`：评分过低。
* `reviewCount < 50`：评论数过少。
* `shippingCost > 10`：物流成本偏高。
* `weight >= 0.5` 或 `volumeLevel === 'large'`：重量 / 体积不适合轻小件。

`riskLevel` 根据风险因素数量生成：

* 0 个风险因素：低风险。
* 1-2 个风险因素：中风险。
* 3 个及以上风险因素：高风险。

该规则可以在面试中用于说明项目的业务分析能力：系统不是简单展示商品，而是根据利润、竞争、评分、评论、物流和轻小件适配度进行综合风险判断。

---

## 本地运行方式

### 1. 启动后端

```bash
cd server
npm install
npm start
```

后端默认运行在：

```txt
http://localhost:3000
```

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在：

```txt
http://localhost:5173
```

---

## 环境变量说明

当前本地开发环境默认使用：

```txt
http://localhost:3000
```

后续部署上线时，前端应通过环境变量配置线上后端地址，例如：

```txt
VITE_API_BASE_URL=https://your-backend-url
```

这样可以避免前端代码写死 `localhost`，方便本地开发和线上部署切换。

---

## 本地可访问地址

### 后端接口

* http://localhost:3000/api/health
* http://localhost:3000/api/products
* http://localhost:3000/api/products?keyword=车载
* http://localhost:3000/api/products?category=车载支架
* http://localhost:3000/api/products?minProfitRate=30
* http://localhost:3000/api/products?sort=profitRateDesc
* http://localhost:3000/api/products/1
* http://localhost:3000/api/dashboard
* http://localhost:3000/api/favorites

### 前端页面

* http://localhost:5173/
* http://localhost:5173/products
* http://localhost:5173/products/1
* http://localhost:5173/analysis
* http://localhost:5173/favorites

---

## 项目截图

> 后续补充项目截图。

建议截图包括：

* Dashboard 数据看板
* 商品列表页
* 商品详情页
* 搜索 / 筛选 / 排序效果
* 候选池页面
* 选品分析页面
* 风险标签与推荐评分展示
* 利润率排行图
* 类目分布图

---

## 项目亮点

* 使用 React + Vite + Node.js + Express 实现前后端分离。
* 基于跨境电商手机支架品类设计业务场景，而不是普通 Todo List。
* 实现商品搜索、类目筛选、利润率筛选和多维排序。
* 封装商品利润测算、风险分析和推荐评分逻辑。
* 使用候选池功能模拟真实选品过程中的商品收藏和跟进流程。
* 使用 Recharts 实现利润率排行和类目分布图表。
* 前端页面包含 Dashboard、Products、ProductDetail、Analysis、Favorites 等完整业务模块。
* 后端接口结构清晰，支持商品列表、详情、Dashboard、候选池增删查。
* 当前使用 JSON 文件模拟数据存储，后续可以平滑迁移到数据库。
* 项目适合用于简历展示和面试讲解。

---

## 当前版本说明

当前版本是 mock 数据阶段的可展示版本：

* 商品数据来自本地 JSON 文件。
* 候选池数据来自本地 JSON 文件。
* 商品图片字段已经预留，后续可补充本地 mock 图片或接入 1688 图片。
* 当前还没有接入真实 Amazon API。
* 当前还没有接入真实 1688 API。
* 当前还没有接入数据库。
* 当前还没有登录注册和用户权限系统。

这些不是永久限制，而是当前版本的阶段性状态。

---

## 后续优化方向

后续可以根据项目展示和简历需要继续扩展：

### 1. UI 与展示优化

* 统一全局颜色、字体、间距和卡片风格。
* 优化 Dashboard、商品卡片、详情页、候选池和分析页。
* 补充商品图片，让页面更像正式作品。
* 增加基础响应式适配。

### 2. 部署上线

* 前端部署到 Vercel。
* 后端部署到 Render、Railway 或 Koyeb。
* 前端通过环境变量请求线上后端。
* 配置 CORS 和路由刷新支持。
* 在 README 中补充在线演示地址。

### 3. 数据库迁移

* 将 `products.json` 和 `favorites.json` 迁移到数据库。
* 可选方案包括 SQLite、MySQL、PostgreSQL、MongoDB。
* 可以使用 Prisma 等工具进行数据建模。
* 尽量保持现有 API 行为不变，降低前端改动成本。

### 4. 真实数据源接入

* 接入 1688 商品数据源，获取货源价格、图片、起批量、供应商等信息。
* 接入 Amazon 商品数据源，辅助分析售价、评分、评论数和竞品情况。
* 设计 mock / real 数据源切换结构。
* 设计数据导入模块，避免核心业务逻辑和第三方 API 强耦合。

### 5. 用户系统与报告能力

* 增加登录注册。
* 实现用户级候选池。
* 增加选品报告导出。
* 增加更完整的数据分析图表。

---

## 项目说明

这个仓库适合作为“学习型工程项目”的阶段性展示版本：

* 有清晰的前后端目录结构。
* 有完整的页面路由和后台系统布局。
* 有商品列表、详情、Dashboard、选品分析和候选池。
* 有搜索、筛选、排序、收藏和取消收藏流程。
* 有利润、竞争、风险和推荐评分计算逻辑。
* 有图表可视化和风险标签展示。
* 有每日开发记录，方便复盘和面试讲解。

后续增强方向不再被固定限制，但所有扩展都应该遵守一个原则：

**只做当前明确规划的任务，不擅自添加与当前目标无关的功能。**
