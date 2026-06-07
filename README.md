# 跨境电商手机支架选品分析平台

## 项目简介

这是一个用于前端实习简历展示的前后端分离项目，聚焦“手机支架”这一跨境电商轻小件品类。

项目通过本地 mock 数据模拟 Amazon 候选商品与 1688 货源信息，围绕利润测算、竞争强度、物流成本、风险等级、推荐评分、候选池管理和图表分析，帮助跨境电商卖家快速筛选更值得跟进的商品。

当前版本已经完成 mock 数据阶段的核心业务闭环，包括商品列表、商品详情、Dashboard 数据看板、选品分析、候选池管理、推荐评分和风险分析等功能，并已完成 Vercel 线上部署。

后续阶段将重点进行 README 截图、简历描述和面试讲解准备。真实 1688 / Amazon API、登录鉴权、完整数据库商品表等能力不再作为绝对限制，而是根据后续明确任务逐步扩展。

---

## 在线预览

> 已完成 Vercel 部署。实际 URL 可在确认后补充到这里。

* 前端预览地址：https://cross-border-phone-holder-analyzer.vercel.app/
* 后端接口地址：https://cross-border-phone-holder-api.vercel.app/
* 后端健康检查：https://cross-border-phone-holder-api.vercel.app/api/health
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
* Vercel Serverless Functions
* Supabase PostgreSQL
* Zhipu GLM API
* JSON 文件备份商品数据

### 当前数据来源

* `Supabase PostgreSQL products` 表
* `Supabase PostgreSQL favorites` 表
* `server/data/products.json` 作为商品数据备份

当前版本中，商品数据已经迁移到 Supabase PostgreSQL `products` 表，后端接口统一读取 Supabase 并返回原有 camelCase 数据结构。`server/data/products.json` 暂时保留为备份数据源。候选池收藏数据继续存储在 Supabase PostgreSQL `favorites` 表中。前端通过浏览器本地生成的匿名 `client_id` 区分不同访问者，后端通过请求头 `x-client-id` 读写对应收藏记录。

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
* 展示当前商品池判断，输出优先跟进、竞争压力和风险排查结论。
* 展示利润率排行柱状图。
* 展示手机支架类型分布饼图。
* 展示推荐分 vs 竞争度散点图，用于识别高推荐、低竞争的机会款。
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

* 使用 Supabase PostgreSQL `favorites` 表保存候选商品。
* 使用匿名 `client_id` 区分不同浏览器访问者。
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

需要请求头：

```txt
x-client-id: 当前浏览器匿名 client_id
```

### `POST /api/favorites`

添加商品到候选池。

需要请求头：

```txt
x-client-id: 当前浏览器匿名 client_id
```

请求体示例：

```json
{
  "productId": 1
}
```

### `DELETE /api/favorites/:id`

根据商品 id 从候选池删除商品。

需要请求头：

```txt
x-client-id: 当前浏览器匿名 client_id
```

### `POST /api/ai/chat`

调用后端封装的 AI 服务，返回基于 Supabase 商品数据的多轮 AI 选品建议。当前支持通过 `AI_PROVIDER` 在 `zhipu` 和 `nvidia` 之间切换。

可选请求头：

```txt
x-client-id: 当前浏览器匿名 client_id，用于读取当前用户候选池商品上下文
```

请求体示例：

```json
{
  "messages": [
    { "role": "user", "content": "帮我推荐适合新手的产品" },
    { "role": "assistant", "content": "建议优先看可折叠桌面手机支架..." },
    { "role": "user", "content": "那物流成本低的呢？" }
  ]
}
```

成功返回示例：

```json
{
  "success": true,
  "data": {
    "reply": "可以优先关注物流成本低、评分稳定且竞争指数较低的手机支架...",
    "provider": "nvidia",
    "model": "deepseek-ai/deepseek-v4-flash"
  }
}
```

错误返回示例：

```json
{
  "success": false,
  "message": "AI 服务暂时不可用，请稍后再试。"
}
```

该接口只在后端读取 `ZHIPU_API_KEY` 或 `NVIDIA_API_KEY`，前端不能直接调用第三方 AI API，也不能配置 `VITE_ZHIPU_API_KEY` / `VITE_NVIDIA_API_KEY`。

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

### 前端环境变量

当前本地开发环境默认使用：

```txt
http://localhost:3000
```

后续部署上线时，前端应通过环境变量配置线上后端地址，例如：

```txt
VITE_API_BASE_URL=https://your-backend-url
```

这样可以避免前端代码写死 `localhost`，方便本地开发和线上部署切换。

### 后端环境变量

后端本地开发使用 `server/.env`，该文件已被 `.gitignore` 忽略，不能提交到 GitHub。

```txt
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_secret_key
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7-flash
AI_PROVIDER=nvidia
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_REQUEST_TIMEOUT_MS=12000
NVIDIA_MODELS=deepseek-ai/deepseek-v4-flash,nvidia/nemotron-3-ultra-550b-a55b,nvidia/nemotron-3-super-120b-a12b,meta/llama-3.3-70b-instruct,openai/gpt-oss-120b,qwen/qwen3-coder-480b-a35b-instruct,mistralai/mistral-medium-3.5-128b,microsoft/phi-4-mini-instruct
```

`SUPABASE_SERVICE_ROLE_KEY` 只能配置在后端环境变量中，不能写入前端代码，也不能使用 `VITE_` 前缀暴露给浏览器。
`ZHIPU_API_KEY` 和 `NVIDIA_API_KEY` 同样只能配置在后端环境变量中，不能写入前端代码，也不能使用 `VITE_` 前缀暴露给浏览器。`AI_PROVIDER` 可选，不配置时默认使用 `zhipu`；设置为 `nvidia` 时会调用 NVIDIA NIM。`ZHIPU_MODEL` 可选，不配置时后端默认使用 `glm-4.7-flash`。`NVIDIA_BASE_URL` 可选，不配置时默认使用 `https://integrate.api.nvidia.com/v1`。`NVIDIA_REQUEST_TIMEOUT_MS` 可选，用于控制单个 NVIDIA 模型请求等待时间，建议本地演示使用 `12000`。

---

## 线上部署说明

当前项目采用两个 Vercel 项目分开部署：

* 前端：Vite React 静态站点。
* 后端：Express 通过 Vercel Serverless Function 运行。

### 后端 Vercel 项目

```txt
Root Directory: server
Framework Preset: Other
Install Command: npm install
Build Command: 留空
Output Directory: 留空
```

后端环境变量：

```txt
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_secret_key
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7-flash
AI_PROVIDER=nvidia
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_REQUEST_TIMEOUT_MS=12000
NVIDIA_MODELS=deepseek-ai/deepseek-v4-flash,nvidia/nemotron-3-ultra-550b-a55b,nvidia/nemotron-3-super-120b-a12b,meta/llama-3.3-70b-instruct,openai/gpt-oss-120b,qwen/qwen3-coder-480b-a35b-instruct,mistralai/mistral-medium-3.5-128b,microsoft/phi-4-mini-instruct
```

后端入口结构：

* `server/app.js`：创建 Express app，注册中间件和路由，并 `export default app`。
* `server/index.js`：本地开发入口，负责 `app.listen(...)`。
* `server/api/index.js`：Vercel Serverless 入口，导出同一个 Express app。
* `server/vercel.json`：将请求 rewrite 到 `/api`，由 Express app 统一处理。

### 前端 Vercel 项目

```txt
Root Directory: client
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

前端环境变量：

```txt
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

### 线上接口检查

```txt
https://cross-border-phone-holder-api.vercel.app/api/health
https://cross-border-phone-holder-api.vercel.app/api/products
https://cross-border-phone-holder-api.vercel.app/api/products/1
https://cross-border-phone-holder-api.vercel.app/api/dashboard
https://cross-border-phone-holder-api.vercel.app/api/favorites
https://cross-border-phone-holder-api.vercel.app/api/ai/chat
```

`/api/favorites` 需要 `x-client-id` 请求头，推荐通过前端页面的收藏和取消收藏流程验证，同时在 Supabase Table Editor 中确认 `favorites` 表记录新增和删除。
`/api/ai/chat` 是 `POST` 接口，需要在后端 Vercel 项目中按 `AI_PROVIDER` 配置 `NVIDIA_API_KEY` 或 `ZHIPU_API_KEY` 后再验证。

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
* http://localhost:3000/api/ai/chat

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
* 使用 Recharts 实现利润率排行、类目分布、推荐分 vs 竞争度等业务图表。
* 优化 Dashboard 首屏业务定位和基础 SEO 页面元信息，提升线上演示完整度。
* 针对接口慢和 Serverless 冷启动场景实现前端缓存与 stale-while-revalidate 体验，主要页面缓存命中时首个有意义内容可见时间可从约 4.6 秒降至 0.27-0.38 秒，测量口径见 `docs/PERFORMANCE_NOTES.md`。
* 前端页面包含 Dashboard、Products、ProductDetail、Analysis、Favorites 等完整业务模块。
* 后端接口结构清晰，支持商品列表、详情、Dashboard、候选池增删查。
* 后端通过 Vercel Serverless 部署，前端通过 Vercel 静态站点部署，项目可通过公网访问。
* 候选池收藏数据接入 Supabase PostgreSQL，商品数据仍保留 JSON mock 数据，便于演示和后续扩展。
* 项目适合用于简历展示和面试讲解。

---

## 当前版本说明

当前版本是 mock 数据阶段的可展示版本：

* 商品数据来自本地 JSON 文件。
* 候选池数据来自 Supabase PostgreSQL。
* 商品图片字段已经预留，后续可补充本地 mock 图片或接入 1688 图片。
* 当前还没有接入真实 Amazon API。
* 当前还没有接入真实 1688 API。
* 当前还没有把商品数据迁移到数据库。
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

### 2. 部署与运维优化

* 补充正式线上访问地址。
* 补充项目截图和演示说明。
* 关注 Vercel Hobby 用量，避免无意义高频访问。
* 根据需要补充错误日志排查和部署故障说明。

### 3. 数据存储增强

* 将 `products.json` 商品数据迁移到数据库。
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
