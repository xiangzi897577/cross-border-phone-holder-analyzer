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

## Day 5 - 2026-05-12

### 今日完成内容
- 创建了 `server/config/businessConfig.js`，把美元转人民币汇率和默认平台手续费率提取为业务配置。
- 创建了 `server/utils/productMetrics.js`，集中封装商品利润、利润率、竞争等级和风险等级计算逻辑。
- 在 `GET /api/products` 中为每个商品附加了计算字段。
- 在 `GET /api/products/:id` 中为单个商品附加了计算字段。
- 保持了原有 `400`、`404`、`500` 错误处理逻辑不变，没有提前实现 Dashboard、搜索、筛选、排序和 favorites。

### 修改了哪些文件
- `server/config/businessConfig.js`
- `server/utils/productMetrics.js`
- `server/routes/products.js`
- `docs/DAILY_LOG.md`

### 新增了哪些工具函数
- `calculatePlatformFee(product)`：计算平台手续费。
- `calculateProfit(product)`：计算单件利润。
- `calculateProfitRate(product)`：计算利润率。
- `getCompetitionLevel(product)`：根据竞争指数返回 `low / medium / high / unknown`。
- `getRiskLevel(product)`：根据利润率、竞争、评分、评论数、物流成本和体积等级判断风险等级。
- `enrichProductMetrics(product)`：返回带有计算字段的新商品对象。

### 利润计算公式是什么
- `revenueCNY = amazonPrice * BUSINESS_CONFIG.usdToCny`
- `platformFee = amazonPrice * BUSINESS_CONFIG.usdToCny * platformFeeRate`
- `totalCost = cost1688 + shippingCost + platformFee`
- `profit = revenueCNY - totalCost`
- `profitRate = profit / totalCost`
- 当前固定汇率来自 `BUSINESS_CONFIG.usdToCny`，数值为 `6.8`，本次没有接入实时汇率接口。

### 风险等级如何判断
- 高风险 `high`：
  - `profitRate < 0.15`
  - 或 `competitionScore >= 80`
  - 或 `rating < 4.2`
  - 或 `shippingCost > cost1688`
  - 或 `volumeLevel === 'large'`
- 中风险 `medium`：
  - `profitRate < 0.3`
  - 或 `competitionScore >= 60`
  - 或 `rating < 4.5`
  - 或 `reviewCount < 100`
- 低风险 `low`：
  - 不满足以上高风险和中风险条件

### 如何测试接口是否返回 profit、profitRate、riskLevel
- 进入 `server` 目录后运行 `node app.js`。
- 浏览器访问 `http://localhost:3000/api/products`，检查每个商品是否包含 `profit`、`profitRate`、`riskLevel`、`revenueCNY`、`platformFee`、`totalCost`、`profitRatePercent`、`competitionLevel`。
- 浏览器访问 `http://localhost:3000/api/products/1`，检查单个商品是否也包含同样的计算字段。
- 也可以在终端执行：
  - `curl http://localhost:3000/api/products`
  - `curl http://localhost:3000/api/products/1`

### 今日重点理解内容
- 为什么要把业务配置放到 `config` 目录，而不是直接在工具函数里硬编码汇率。
- 为什么利润计算逻辑应该抽到 `utils`，避免把业务计算堆在路由文件里。
- 为什么 `enrichProductMetrics` 要返回新对象，这样不会污染原始商品数据，后续做筛选、排序和统计时也更安全。
- 为什么风险等级判断要先判断高风险，再判断中风险，避免判断顺序出错。
- 为什么接口层只负责读取数据和返回结果，计算细节交给工具函数处理。

### 明日任务
- 实现 `GET /api/dashboard` 接口。
## Day 6 - 2026-05-12

### 今日完成内容
- 新增 `server/routes/dashboard.js`，单独实现 `GET /api/dashboard` 接口。
- Dashboard 数据继续来自 `server/data/products.json`，没有改动商品字段结构。
- 先对每个商品执行 `enrichProductMetrics(product)`，再基于计算后的 `profitRate`、`profit`、`riskLevel` 等字段做统计。
- 在 `server/app.js` 中注册了 `dashboardRouter`，保持 `app.js` 只负责引入和挂载路由。
- 验证了 `GET /api/health`、`GET /api/products`、`GET /api/products/:id`、`GET /api/dashboard` 都可正常访问。

### 修改了哪些文件
- `server/app.js`
- `server/routes/dashboard.js`
- `docs/DAILY_LOG.md`

### 新增了哪个接口
- `GET /api/dashboard`

### Dashboard 返回哪些统计字段
- `totalProducts`
- `averageProfitRate`
- `averageProfitRatePercent`
- `highPotentialCount`
- `riskProductCount`
- `topProfitProducts`
- `categoryDistribution`
- `averageCompetitionScore`
- `lowCompetitionHighProfitCount`

### 每个统计字段的计算逻辑
- `totalProducts`：直接使用 `products.length`。
- `averageProfitRate`：先 `map` enrich，再用 `reduce` 求所有商品 `profitRate` 总和，除以商品总数，空数组时返回 `0`，保留 4 位小数。
- `averageProfitRatePercent`：用 `averageProfitRate * 100`，保留 1 位小数。
- `highPotentialCount`：用 `filter` 统计同时满足 `profitRate >= 0.3`、`competitionScore < 70`、`rating >= 4.4` 的商品数量。
- `riskProductCount`：用 `filter` 统计 `riskLevel === 'high'` 的商品数量。
- `topProfitProducts`：先复制数组，再按 `profitRate` 从高到低 `sort`，然后 `slice(0, 5)`，最后 `map` 出 Dashboard 需要的核心字段。
- `categoryDistribution`：先用 `reduce` 按 `category` 累加数量，再用 `Object.entries().map()` 转成 `{ category, count }` 数组。
- `averageCompetitionScore`：用 `reduce` 求所有商品 `competitionScore` 总和，除以商品总数，空数组时返回 `0`，保留 1 位小数。
- `lowCompetitionHighProfitCount`：用 `filter` 统计同时满足 `profitRate >= 0.3`、`competitionScore < 50` 的商品数量。

### 如何测试 /api/dashboard
- 进入 `server` 目录后运行 `node app.js`。
- 浏览器访问 `http://localhost:3000/api/dashboard`。
- 也可以在终端执行 `curl http://localhost:3000/api/dashboard`。
- 同时回归测试：
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/products`
- `http://localhost:3000/api/products/1`

### 今日重点理解内容
- 为什么要把 Dashboard 统计逻辑放到独立的 `routes/dashboard.js`，而不是直接写在 `app.js`。
- `app.use('/api/dashboard', dashboardRouter)` 的作用：给路由模块统一加上接口前缀。
- 为什么 Dashboard 统计要基于 `enrichProductMetrics(product)` 之后的数据，而不是直接拿原始 JSON 字段硬算。
- `map`、`filter`、`reduce`、`sort`、`slice` 在后端统计接口中的分工。
- 为什么排序前要用 `[...]` 复制数组，避免直接修改原数组顺序。
- 为什么空数组场景下要主动返回 `0` 和空数组，避免接口崩溃。

### 明日任务
- 第一周复盘与后端整理
### CategoryDistribution 深入理解补充
- `categoryDistribution` 之所以先用 `reduce` 统计成对象，再用 `Object.entries().map()` 转成数组，是因为“对象更适合计数，数组更适合前端展示和图表使用”。
- `reduce` 阶段的目标不是直接得到最终展示结果，而是先得到一个中间统计对象，例如：
- `{ '桌面手机支架': 2, '车载手机支架': 1 }`
- 这个中间对象的 key 是类目名，value 是该类目的商品数量，所以很适合做累计统计。
- `distributionMap[category] = (distributionMap[category] || 0) + 1` 的意思是：如果这个类目之前没有出现过，就从 `0` 开始计数；如果出现过，就在原来的数量上加 `1`。
- 这里准确的理解是：`distributionMap` 才是对象，`category` 是变量，`distributionMap[category]` 表示“用 `category` 变量当前的值，当作对象的键名去取值或赋值”。
- 例如 `const category = '桌面手机支架'` 时，`distributionMap[category] = 1` 实际效果等价于 `distributionMap['桌面手机支架'] = 1`。
- 这不是“创建了一个叫 category 的对象名”，而是“把变量 `category` 里的字符串值，当成对象属性名”。
- `distributionMap.category` 和 `distributionMap[category]` 不一样：
- `distributionMap.category` 的键名固定就是 `category`
- `distributionMap[category]` 的键名是变量 `category` 的值，比如 `桌面手机支架`、`车载手机支架`
- 这个场景必须用 `distributionMap[category]`，因为类目名是动态变化的，不是固定写死的。
- `Object.entries(distributionMap)` 会把统计对象转成二维数组，例如：
- `[['桌面手机支架', 2], ['车载手机支架', 1]]`
- 这里每一项都是 `[键, 值]`，也就是 `[category, count]`。
- 后面的 `.map(([category, count]) => ({ category, count }))` 是把二维数组再转成对象数组，最终得到前端更容易使用的格式：
- `[{ category: '桌面手机支架', count: 2 }, { category: '车载手机支架', count: 1 }]`
- 这一整段的核心思路可以记成：
- “先统计，再转换”
- “先得到适合累计的对象，再得到适合展示的数组”

## Day 7 - 2026-05-12

### 今日完成内容
- 检查并确认 `GET /api/health`、`GET /api/products`、`GET /api/products/:id`、`GET /api/dashboard` 四个接口继续可用
- 复核 `server/app.js`，确认保留 `cors`、`express.json()`、`/api/health`，并继续只负责入口和路由注册
- 复核 `server/routes/products.js`，确认列表接口和详情接口继续返回 Day 5 的计算字段
- 复核 `server/routes/dashboard.js`，确认统计逻辑继续基于 `enrichProductMetrics(product)` 之后的数据
- 将 `server/data/products.json` 从 12 条补足到 20 条手机支架商品数据
- 更新 `README.md` 初版项目介绍
- 更新 Day 7 开发记录，完成第一阶段后端收尾整理

### 检查了哪些接口
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/dashboard`

### 商品数据是否达到 20 条
- 已达到，当前 `server/data/products.json` 共 20 条商品数据

### 修改了哪些文件
- `server/app.js`
- `server/data/products.json`
- `README.md`
- `docs/DAILY_LOG.md`

### README 更新了什么
- 增加了项目背景、项目目标和当前技术栈
- 增加了当前已完成的 4 个接口说明
- 增加了本地运行方式与接口访问地址
- 增加了第一阶段完成情况和下一阶段计划

### 第一阶段后端完成情况
- 后端入口和路由注册结构已整理完成
- 商品 mock 数据已扩充到 20 条
- 商品列表、商品详情、Dashboard 统计接口均可访问
- 商品接口已包含利润、利润率、平台手续费、竞争等级、风险等级等计算字段
- 第一阶段后端基础接口和数据准备工作已完成

### 当前仍然存在的问题
- 当前还没有 React 前端页面，接口尚未进入页面联调阶段
- 搜索、筛选、排序和 favorites 候选池功能尚未开始
- Dashboard 目前只有后端统计接口，还没有前端图表展示

### 下一阶段任务
- 进入 React 前端页面开发阶段
- 优先从基础路由、页面结构和接口请求封装开始
## Day 8 - 2026-05-13

### 今日完成内容
- 在 `client` 中安装了 `react-router-dom`
- 在 `client/src/pages` 下创建了 5 个基础页面组件
- 配置了前端基础路由和临时导航区域
- 清理了 Vite 默认示例首页内容，替换为项目当前的 Day 8 页面结构
- `ProductDetailPage` 已经可以通过 `useParams` 读取 URL 中的商品 `id`

### 安装了什么依赖
- `react-router-dom`

### 创建了哪些页面组件
- `DashboardPage.jsx`
- `ProductsPage.jsx`
- `ProductDetailPage.jsx`
- `AnalysisPage.jsx`
- `FavoritesPage.jsx`

### 配置了哪些路由
- `/` -> `DashboardPage`
- `/products` -> `ProductsPage`
- `/products/:id` -> `ProductDetailPage`
- `/analysis` -> `AnalysisPage`
- `/favorites` -> `FavoritesPage`

### 如何测试页面切换
- 进入 `client` 目录后运行 `npm run dev`
- 在浏览器访问 `http://localhost:5173/`
- 点击顶部导航，检查是否可以在“数据看板”“商品列表”“选品分析”“候选池”之间切换
- 直接访问以下地址，检查页面是否能正常显示
- `http://localhost:5173/`
- `http://localhost:5173/products`
- `http://localhost:5173/products/1`
- `http://localhost:5173/analysis`
- `http://localhost:5173/favorites`
- 访问 `/products/1` 时，确认页面能显示当前商品 id 为 `1`

### 今日重点理解内容
- `react-router-dom` 是如何让 React 单页应用支持前端路由切换的
- `BrowserRouter` 如何监听地址栏变化并提供路由上下文
- `Routes` 和 `Route` 如何根据当前路径渲染对应页面
- `NavLink` 如何用于页面跳转以及当前导航高亮
- 动态路由 `/products/:id` 的含义
- `useParams` 如何读取 URL 参数

### 明日任务
- 创建整体 Layout
- 创建 Sidebar
- 创建 Header

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 8 记录

## Day 9 - 2026-05-13

### 今日完成内容
- 在 `client/src/components` 下新增了 `Layout.jsx`、`Sidebar.jsx`、`Header.jsx`
- 把 Day 8 原本直接写在 `App.jsx` 里的头部和导航结构抽离到独立组件
- 使用 `Layout` 包裹 `Routes`，让 `App.jsx` 只负责整体路由配置和页面挂载
- 完成了后台管理系统风格的初步布局：左侧 Sidebar、右侧 Header、主内容区
- 保持现有页面路由不变，没有请求后端接口，没有新增业务逻辑，没有修改 `server` 目录

### 修改了哪些文件
- `client/src/App.jsx`
- `client/src/App.css`
- `client/src/index.css`
- `docs/DAILY_LOG.md`

### 新增了哪些文件
- `client/src/components/Layout.jsx`
- `client/src/components/Sidebar.jsx`
- `client/src/components/Header.jsx`

### 路由测试结果
- `/` 可以正常显示 Dashboard 页面
- `/products` 可以正常显示商品列表占位页
- `/products/1` 可以正常显示商品详情页，并通过 `useParams` 显示当前商品 id
- `/analysis` 可以正常显示选品分析占位页
- `/favorites` 可以正常显示候选池占位页
- 构建检查通过后，说明当前前端代码没有明显语法报错

### 今日重点理解知识点
- 为什么要把布局组件从 `App.jsx` 中拆出去：让页面入口文件只负责路由，不负责具体布局细节
- `Layout` 为什么要接收 `children`：这样同一套后台布局可以复用到不同路由页面
- `NavLink` 和 `Link` 的区别：`NavLink` 更适合导航栏，因为它可以根据当前路径自动加上激活态样式
- Sidebar、Header、Main Content 的职责划分：结构更清楚，后续继续扩展时更容易维护
- 为什么这一天先做整体骨架，而不提前接接口或写业务组件：先把页面结构搭稳，后面接真实页面内容会更顺

### 明天计划
- 进入 Day 10，开始封装前端请求函数，并在 `ProductsPage` 中请求商品列表接口

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 9 记录

## Day 10 - 2026-05-13

### 今日完成内容
- 创建了 `client/src/services/api.js`。
- 在 `api.js` 中封装了 `getProducts`，统一请求 `http://localhost:3000/api/products`。
- 在 `ProductsPage` 中使用 `useEffect` 在页面加载时请求商品列表接口。
- 实现了 `products`、`loading`、`error` 三个基础状态。
- 按 Day 10 范围临时渲染了商品名称、Amazon 价格、1688 成本、利润和利润率。
- 保持今天只做商品列表接口联调，没有提前实现搜索、筛选、排序、收藏、图表和复杂卡片。

### 修改了哪些文件
- `client/src/pages/ProductsPage.jsx`
- `docs/DAILY_LOG.md`

### 新增了哪些文件
- `client/src/services/api.js`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:5173/products`

### 如何测试
- 先启动后端，浏览器访问 `http://localhost:3000/api/products`，确认能返回商品数组 JSON。
- 再启动前端，访问 `http://localhost:5173/products`。
- 页面首次进入时应先显示“商品列表加载中...”。
- 请求成功后应显示商品名称、Amazon 价格、1688 成本、利润、利润率。
- 如果临时关闭后端服务并刷新 `/products`，页面应显示错误提示。
- 如果把后端接口临时改成返回空数组，页面应显示“暂无商品数据。”。
- 可以打开浏览器开发者工具 `Network` 面板，确认前端实际请求了 `http://localhost:3000/api/products`，而不是读取前端本地 mock 数据。

### 本次验证结果
- `client` 执行 `npm run build` 已通过，说明前端代码没有明显语法和打包错误。
- 使用 `curl.exe http://localhost:3000/api/products` 验证后端接口成功返回商品数组。
- 当前后端接口返回了 20 条商品数据，并包含 `productName`、`profit`、`profitRatePercent` 等前端正在使用的字段。

### 遇到的问题
- 联调前先检查了跨域配置，确认 `server/app.js` 已经启用 `cors()`，所以今天不需要额外修改后端。
- 后端 `GET /api/products` 返回的是商品数组本身，不是 `{ data: [] }` 结构，所以前端直接保存 `response.json()` 的结果即可。

### 今日重点理解知识点
- 为什么要把接口请求函数单独放到 `services` 目录，而不是直接写在页面组件里。
- `useEffect(() => { ... }, [])` 为什么适合处理“页面首次加载后请求数据”。
- `loading`、`error`、`products` 三个状态如何配合完成异步请求页面。
- 为什么要根据 `response.ok` 手动判断请求是否成功。
- 为什么即使后端已经有计算字段，前端渲染时也要做好默认值兜底，避免页面崩溃。

### 明天计划
- 进入 Day 11，开始把商品列表从临时文本渲染升级为基础商品展示组件。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 10 记录

## Day 11 - 2026-05-14

### 今日完成内容
- 新增 `ProductCard` 组件，负责展示单个商品的图片、名称、类型、Amazon 售价、1688 成本、利润率、竞争指数和评分。
- 新增 `ProductGrid` 组件，负责用网格布局遍历并渲染多个商品卡片。
- 把 `ProductsPage` 成功请求后的展示方式从临时文本列表升级为卡片网格展示。
- 商品卡片在 `product.id` 存在时支持点击跳转到 `/products/:id`。
- 为商品卡片补充了图片兜底、字段兜底和 hover 样式，避免字段缺失或图片加载失败时页面出错。

### 修改了哪些文件
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 新增了哪些文件
- `client/src/components/ProductCard.jsx`
- `client/src/components/ProductGrid.jsx`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:5173/products`

### 如何测试
- 先启动后端，访问 `http://localhost:3000/api/products`，确认商品数组仍然来自 Node 后端接口。
- 再启动前端，访问 `http://localhost:5173/products`，确认商品列表已经从文本列表变成卡片网格。
- 检查每张卡片是否展示了商品图片、名称、类型、Amazon 售价、1688 成本、利润率、竞争指数和评分。
- 点击任意一张带 `id` 的商品卡片，确认地址会跳转到 `/products/:id`。
- 直接访问 `http://localhost:5173/products/1`，确认 `ProductDetailPage` 仍然可以显示当前商品 id。
- 如果某张图片路径失效，确认卡片会显示“暂无图片”，而不是让页面报错。

### 本次验证结果
- `ProductsPage` 仍然保留了 Day 10 的 `useEffect` 请求、`loading`、`error` 和空状态逻辑。
- 商品列表展示职责已经拆分为 `ProductsPage -> ProductGrid -> ProductCard` 三层，更符合组件分工。
- 商品详情跳转继续使用 `react-router-dom` 的 `Link`，不会刷新浏览器页面。

### 遇到的问题
- 当前商品数据里的图片路径是 `/images/phone-holder-x.jpg`，但前端静态目录里暂时没有对应图片文件，所以本次先在卡片里补了图片加载失败兜底。
- 任务要求今天不改后端、不接详情接口，所以详情页仍然保持 Day 8 的占位实现，只验证路由跳转。

### 今日重点理解知识点
- 为什么要把“页面请求数据”和“单个商品展示”拆到不同组件里。
- `ProductsPage`、`ProductGrid`、`ProductCard` 三层职责分别是什么。
- 为什么卡片跳转要用 `Link`，而不是普通 `a` 标签。
- 为什么组件渲染接口数据时要做字段兜底和图片兜底。
- CSS Grid 如何快速把多个商品卡片排成响应式网格。

### 明天计划
- 进入 Day 12，开始让 `ProductDetailPage` 根据路由参数请求单个商品详情接口。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 11 记录

## Day 12 - 2026-05-14

### 今日完成内容
- 在 `client/src/services/api.js` 中新增了 `getProductById(id)`，专门请求 `GET /api/products/:id`
- 在 `ProductDetailPage` 中使用 `useParams()` 获取 URL 中的商品 `id`
- 在 `ProductDetailPage` 中使用 `useEffect` 请求商品详情接口
- 实现了 `loading`、`error`、`product` 三个基础状态，并补充了图片加载失败占位
- 页面已展示商品基础信息、价格、成本、利润、风险等级、风险因素和推荐理由
- 页面保留了 `Link to="/products"` 的返回商品列表入口
- 本次没有新增后端接口，没有修改 `server` 目录，没有提前实现搜索、筛选、排序、收藏和图表功能

### 修改了哪些文件
- `client/src/services/api.js`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 新增了哪些代码
- `getProductById(id)`：请求单个商品详情接口，并处理 `400`、`404` 和通用错误
- `ProductDetailPage` 的详情请求逻辑：根据路由参数 `id` 获取后端商品详情
- 详情页信息块样式：让基础信息、价格利润、市场风险和推荐说明更清晰

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:5173/products`
  - 点击商品卡片进入 `http://localhost:5173/products/1`

### 如何测试
- 先启动后端，访问 `http://localhost:3000/api/products/1`，确认可以返回单个商品详情 JSON
- 再启动前端，访问 `http://localhost:5173/products`，点击任意商品卡片进入详情页
- 正常商品测试：
  - 访问 `http://localhost:5173/products/1`
  - 页面应先显示“商品详情加载中...”
  - 请求成功后应显示商品名称、分类、图片、供应商、材质、价格、利润、风险和推荐理由
- 不存在商品测试：
  - 访问 `http://localhost:5173/products/999`
  - 页面应显示 `请求失败：商品不存在`
- 非法 id 测试：
  - 访问 `http://localhost:5173/products/abc`
  - 页面应显示 `请求失败：商品 id 不合法`
- 回归测试：
  - 访问 `http://localhost:5173/products`
  - 确认 Day 11 的商品卡片列表和点击跳转仍然正常

### 今日重点理解知识点
- 为什么详情页要通过 `useParams()` 读取 URL 中的 `id`
- 为什么 `useEffect` 的依赖数组要写 `[id]`，这样当 `/products/1` 切到 `/products/2` 时会重新请求
- `loading`、`error`、`product` 三个状态如何配合完成异步请求页面
- 为什么把请求 `fetch` 逻辑封装在 `services/api.js`，而不是直接写在页面 JSX 里
- 为什么前端要根据 `response.status` 区分 `400`、`404` 和其他错误，给用户更明确的提示
- 为什么详情页渲染接口数据时要做默认值兜底，避免字段缺失导致页面报错

### 明天计划
- 进入 Day 13，开始封装 `getDashboard`
- 创建 Dashboard 指标卡片组件
- 请求 `/api/dashboard` 并展示核心统计数据

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 12 记录

## Day 13 - 2026-05-15

### 今日完成内容
- 在 `client/src/services/api.js` 中新增了 `getDashboard()`，统一请求 `GET /api/dashboard`。
- 新增 `client/src/components/StatCard.jsx`，负责展示单个 Dashboard 指标卡。
- 在 `DashboardPage` 中使用 `useEffect` 请求 Dashboard 数据，并实现了 `dashboard`、`loading`、`error` 三个基础状态。
- 首页已展示 4 个核心指标：总商品数、平均利润率、高潜力商品数、风险商品数。
- 在 `client/src/App.css` 中补充了 Dashboard 指标卡样式，让首页开始具备数据看板感觉。
- 保持了 Day 10 的商品列表接口联调和 Day 12 的商品详情接口联调逻辑不变，没有修改 `server` 目录。

### 修改了哪些文件
- `client/src/services/api.js`
- `client/src/pages/DashboardPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 新增了哪些文件
- `client/src/components/StatCard.jsx`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:5173/`

### 如何测试
- 先启动后端，访问 `http://localhost:3000/api/dashboard`，确认可以返回 Dashboard JSON 数据。
- 再启动前端，访问 `http://localhost:5173/`，确认页面会先显示“Dashboard 数据加载中...”。
- 请求成功后，页面应显示总商品数、平均利润率、高潜力商品数、风险商品数 4 张指标卡。
- 回归测试商品列表：
  - 访问 `http://localhost:5173/products`
  - 确认 Day 10 和 Day 11 的商品列表请求与卡片展示仍然正常
- 回归测试商品详情：
  - 访问 `http://localhost:5173/products/1`
  - 确认 Day 12 的商品详情请求和页面展示仍然正常
- 错误状态测试：
  - 关闭后端服务后刷新 `http://localhost:5173/`
  - 页面应显示 `请求失败：获取 Dashboard 数据失败` 或浏览器返回的网络错误提示，而不是页面崩溃

### 本次验证结果
- `server` 端通过 `node app.js` + `curl.exe http://localhost:3000/api/dashboard` 确认 Dashboard 接口可正常返回 JSON。
- `client` 端执行 `npm run build` 通过，说明 Day 13 的前端改动没有引入明显语法或打包错误。

### 遇到的问题
- 后端返回的平均利润率字段同时包含 `averageProfitRate` 和 `averageProfitRatePercent`，前端优先展示百分比字段，同时保留了对原始小数字段的兜底处理，避免字段变化时页面直接报错。
- 当前环境里无法像浏览器那样直接肉眼检查首页视觉效果，所以本次主要通过接口返回、构建结果和代码逻辑做验证。

### 今日重点理解知识点
- 为什么要把 `getDashboard()` 放到 `services/api.js`，而不是把 `fetch` 直接写在页面 JSX 里。
- `DashboardPage` 中 `dashboard`、`loading`、`error` 三个状态分别负责什么。
- `useEffect(() => { ... }, [])` 为什么适合处理“首页首次进入时请求一次 Dashboard 数据”。
- 为什么要对后端返回字段做默认值兜底，比如数量默认显示 `0`、百分比默认显示 `0.0%`。
- 为什么要把单个指标卡拆成 `StatCard` 组件，而不是把 4 张卡的结构全堆在页面里。

### 明天计划
- 进入 Day 14，检查 Dashboard、商品列表、商品详情这三条前端主流程是否稳定。
- 继续做第二周复盘，修复联调和样式细节问题。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 13 记录

## Day 14 - 2026-05-15：第二周复盘

### 今日完成
- 检查了 `App.jsx` 中的前端主路由配置，确认 `/`、`/products`、`/products/:id`、`/analysis`、`/favorites` 五条主路由继续存在。
- 复查了 `Sidebar` 导航配置，确认继续使用 `NavLink` 实现当前导航项高亮，`/` 路由保留 `end` 处理，避免首页高亮串到其他路由。
- 复查了 `ProductsPage`、`ProductGrid`、`ProductCard`，确认商品列表继续请求 Node 后端 `GET /api/products`，不是前端 mock 数据。
- 复查了 `ProductDetailPage`，确认继续使用 `useParams()` 获取 `id`，并请求 `GET /api/products/:id`。
- 复查了 `DashboardPage` 和 `StatCard`，确认首页继续请求 `GET /api/dashboard` 并展示 4 个核心指标。
- 整理了 `client/src/services/api.js`，保留 `fetch` 方案，补了统一响应解析、基础 JSON 校验和更明确的后端连接失败提示。
- 为列表页、详情页、Dashboard 页补了 `AbortController` 清理逻辑，减少切页或卸载时的异步状态污染。
- 修复了 `ProductDetailPage` 的 `react-hooks/set-state-in-effect` lint 报错。
- 小范围整理了第二周页面文案和样式，补了 loading / error / empty 三种提示样式，修正了 Sidebar、Header 和占位页里残留的阶段性文案。

### 测试结果
- `npm run lint` 通过。
- `npm run build` 通过。
- `http://localhost:3000/api/health` 正常。
- `http://localhost:3000/api/products` 正常。
- `http://localhost:3000/api/products/1` 正常。
- `http://localhost:3000/api/products/999` 返回 `404`，错误状态符合预期。
- `http://localhost:3000/api/products/abc` 返回 `400`，错误状态符合预期。
- `http://localhost:3000/api/dashboard` 正常。
- `http://localhost:5173/` 正常返回前端页面。
- `http://localhost:5173/products` 正常返回前端页面。
- `http://localhost:5173/products/1` 正常返回前端页面。
- `http://localhost:5173/products/999` 正常返回前端页面，前端代码会展示错误状态。
- `http://localhost:5173/products/abc` 正常返回前端页面，前端代码会展示错误状态。
- `http://localhost:5173/analysis` 正常返回前端页面。
- `http://localhost:5173/favorites` 正常返回前端页面。

### 遇到的问题
- `ProductDetailPage` 原本在 `useEffect` 中同步调用 `setState`，触发了 ESLint 的 `react-hooks/set-state-in-effect` 报错，本次已改成更稳定的请求清理写法。
- 前端请求层原本对网络异常没有统一中文提示，后端未启动时更容易直接看到浏览器原始报错，本次已改为统一提示检查 `http://localhost:3000`。
- 页面里还残留了 Day 9 和早期占位阶段的说明文案，本次一并整理，避免第二周收尾版本看起来像未清理的过程稿。
- 当前环境只能确认前端地址可访问、构建通过和代码逻辑正确，`Sidebar` 激活态与商品卡片点击跳转主要通过代码实现和本地地址回归确认，没有做浏览器可视化录屏级别验证。

### 当前主流程结论
- Dashboard、商品列表、商品详情三条主流程当前都继续从 Node 后端取数。
- 非法商品 id 和不存在商品 id 已有明确错误状态，不会直接出现明显的 `undefined`、`null` 或 `NaN`。
- 第二周前后端主流程已经可以稳定跑通，适合作为第三周继续做搜索、筛选、排序前的基线版本。

### 当前仍待优化点
- 当前商品图片仍然主要依赖兜底占位，后续如果补充真实静态图片资源，商品卡片和详情页会更完整。
- `AnalysisPage` 和 `FavoritesPage` 目前仍是占位结构，符合当前开发计划，但第三周后续仍需要按排期继续实现真实业务内容。
- 目前只做了小范围布局稳定性调整，还没有进入更系统的 UI 统一和展示优化阶段。

### 明天计划
- 进入第三周功能增强阶段，后续再做搜索、筛选、排序、候选池、图表等功能。

## Day 15 - 2026-05-15：搜索功能

### 今日完成内容
- 在 `server/routes/products.js` 中为 `GET /api/products` 增加了 `keyword` 查询参数支持。
- 后端搜索范围已覆盖 `productName`、`category` 和 `tags`，并统一做了 `trim()` 和不区分大小写处理。
- 保持了原有 `readProducts()`、`500` 错误处理和 `enrichProductMetrics(product)` 增强逻辑不变，确保搜索结果仍然包含 `profit`、`profitRate`、`riskLevel`、`competitionLevel` 等字段。
- 新增了 `client/src/components/SearchInput.jsx`，支持输入关键词、点击搜索、按 Enter 搜索和清空关键词。
- 在 `client/src/services/api.js` 中让 `getProducts(keyword, options)` 支持可选关键词参数，并使用 `URLSearchParams` 拼接查询字符串。
- 在 `client/src/pages/ProductsPage.jsx` 中接入了搜索状态和搜索请求，让页面首次加载全部商品，搜索后请求后端接口，清空后重新请求全部商品。
- 在 `client/src/App.css` 中补充了搜索输入框、按钮和信息提示样式，保持和当前后台系统风格一致。

### 修改了哪些文件
- `server/routes/products.js`
- `client/src/components/SearchInput.jsx`
- `client/src/services/api.js`
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/products?keyword=车载`
  - `http://localhost:3000/api/products?keyword=磁吸`
  - `http://localhost:3000/api/products?keyword=折叠`
  - `http://localhost:3000/api/products?keyword=直播`
  - `http://localhost:5173/products`

### 如何测试
- 后端接口测试：
  - 访问 `http://localhost:3000/api/products`，确认返回全部商品数组。
  - 访问 `http://localhost:3000/api/products?keyword=车载`，确认只返回和车载相关的商品。
  - 访问 `http://localhost:3000/api/products?keyword=磁吸`，确认能匹配商品名、分类或标签中包含“磁吸”的商品。
  - 访问 `http://localhost:3000/api/products?keyword=折叠`，确认能匹配商品名和标签里的“折叠”。
  - 访问 `http://localhost:3000/api/products?keyword=直播`，确认能返回直播相关商品。
  - 访问 `http://localhost:3000/api/products?keyword=不存在的关键词`，确认返回 `[]`，而不是报错。
  - 随机检查搜索结果里的商品对象，确认仍然包含 `profit`、`profitRate`、`riskLevel`、`competitionLevel` 等增强字段。
- 前端页面测试：
  - 打开 `http://localhost:5173/products`，确认首次进入会加载全部商品。
  - 在输入框中输入“车载”“磁吸”“折叠”“直播”，点击“搜索”或按 Enter，确认页面会刷新为对应搜索结果。
  - 输入不存在的关键词，确认页面显示空状态提示。
  - 点击“清空”，确认输入框被清空，并恢复全部商品列表。
  - 关闭后端后刷新页面，确认原有错误状态仍然存在。

### 遇到的问题和解决方式
- 问题 1：后端搜索后如果直接返回过滤前的数据，就会丢失 Day 5 增强的利润、风险、竞争等级字段。
- 解决方式：先按 `keyword` 过滤原始商品数组，再对过滤后的结果执行 `enrichProductMetrics(product)`。
- 问题 2：中文关键词和特殊字符如果直接手写到 URL 字符串里，后续维护时容易出错。
- 解决方式：前端在 `getProducts` 中统一使用 `URLSearchParams` 拼接查询参数。
- 问题 3：如果用户重复搜索同一个关键词，只靠 `searchedKeyword` 一个状态值，不一定会重新触发请求。
- 解决方式：在 `ProductsPage` 中增加请求触发计数，让“再次搜索同一个词”和“清空恢复全部”都能重新发请求。

### 今日重点理解知识点
- `req.query.keyword` 如何读取 URL 查询参数。
- 为什么搜索前要先做 `String()`、`trim()` 和 `toLowerCase()`。
- 为什么 `tags` 是数组时要用 `some()` 遍历每个标签做包含判断。
- 为什么前端不做本地假搜索，而是把关键词传给后端接口，让接口返回真正过滤后的结果。
- `ProductsPage -> getProducts(keyword) -> /api/products?keyword=xxx -> productsRouter -> setProducts` 这条数据流是怎样串起来的。
- 为什么要把搜索输入框封装成可复用组件，而不是把输入框和按钮直接堆在页面里。

### 明日计划
- 进入 Day 16，开始实现类目筛选功能。
- 继续保持前后端联动方式，由前端携带查询参数、后端负责真实过滤。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 15 记录

## Day 16 - 2026-05-17：类目筛选

### 今日完成内容
- 在 `server/routes/products.js` 中为 `GET /api/products` 增加了 `category` 查询参数支持。
- 后端现在支持 `keyword` 和 `category` 组合查询：先按关键词匹配 `productName`、`category`、`tags`，再按 `category.trim()` 做精确匹配。
- 保持了 `enrichProductMetrics(product)` 增强逻辑，筛选结果仍然包含 `profit`、`profitRate`、`riskLevel`、`competitionLevel` 等字段。
- 新增 `client/src/components/CategoryFilter.jsx`，只负责类目下拉框 UI，不直接请求接口。
- 在 `client/src/services/api.js` 中把 `getProducts` 改为支持 `filters` 对象，并用 `URLSearchParams` 拼接 `keyword` 和 `category`。
- 在 `ProductsPage` 中接入类目状态、组合查询、切换类目自动刷新和“重置筛选”按钮。
- 小范围整理了商品列表工具栏样式，让搜索框、类目筛选和重置按钮在同一行展示。
- 将 `products.json` 中用于筛选的类目统一到 Day 16 的六个类目：桌面支架、车载支架、折叠支架、磁吸支架、懒人支架、直播支架。

### 修改了哪些文件
- `server/routes/products.js`
- `server/data/products.json`
- `client/src/components/CategoryFilter.jsx`
- `client/src/services/api.js`
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/products?category=车载支架`
  - `http://localhost:3000/api/products?keyword=磁吸&category=磁吸支架`
  - `http://localhost:5173/products`

### 如何测试
- 后端接口测试：
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/products?category=车载支架`
  - `http://localhost:3000/api/products?category=磁吸支架`
  - `http://localhost:3000/api/products?keyword=车载&category=车载支架`
  - `http://localhost:3000/api/products?keyword=直播&category=直播支架`
  - `http://localhost:3000/api/products?keyword=不存在的关键词&category=车载支架`
- 前端页面测试：
  - 打开 `http://localhost:5173/products`，确认首次显示全部商品。
  - 依次选择六个类目，确认商品列表会刷新。
  - 输入关键词后点击“搜索”，确认会结合当前类目一起筛选。
  - 输入不存在的关键词并选择类目，确认显示空状态：没有找到符合条件的商品，请尝试更换关键词或类目。
  - 点击“重置筛选”，确认 keyword 和 category 都被清空，并恢复全部商品。

### 本次验证结果
- `client` 执行 `npm run lint` 通过。
- `client` 执行 `npm run build` 通过。
- 使用临时 3100 端口挂载 `productsRouter` 验证后端筛选逻辑：
  - 全部商品返回 20 条。
  - `category=车载支架` 返回 4 条。
  - `category=磁吸支架` 返回 3 条。
  - `keyword=车载&category=车载支架` 返回 4 条。
  - `keyword=直播&category=直播支架` 返回 4 条。
  - `keyword=不存在的关键词&category=车载支架` 返回 0 条。
- 随机检查筛选结果，确认仍然包含利润、利润率、风险等级、竞争等级等增强字段。

### 遇到的问题和解决方式
- 问题 1：现有商品数据里很多类目是“车载手机支架”“磁吸手机支架”，但 Day 16 验收使用“车载支架”“磁吸支架”。
- 解决方式：把商品数据中的筛选类目统一成今天要求的六个类目，保证后端可以按 `category.trim()` 做精确匹配。
- 问题 2：本地 3000 端口已有旧后端进程占用，直接请求会命中旧服务。
- 解决方式：没有强行关闭用户进程，而是临时在 3100 端口挂载同一个路由完成隔离验证。

### 今日重点理解知识点
- `req.query.category` 如何读取类目查询参数。
- 为什么 `category` 适合精确匹配，而 `keyword` 适合模糊匹配。
- 为什么组合筛选可以理解成“先筛一遍 keyword，再筛一遍 category”。
- 为什么 `getProducts({ keyword, category })` 要用 `URLSearchParams` 拼接参数，避免中文和特殊字符出错。
- `ProductsPage -> getProducts({ keyword, category }) -> /api/products?keyword=xxx&category=xxx -> productsRouter -> ProductGrid` 这条前后端数据流。

### 明日计划
- 进入 Day 17，开始实现利润率区间筛选。
- 继续保持后端负责真实筛选，前端负责收集筛选条件和展示状态。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 16 记录

## Day 17 - 2026-05-18：利润率筛选

### 今日完成内容
- 在 `server/routes/products.js` 中为 `GET /api/products` 增加了 `minProfitRate` 查询参数支持。
- 后端现在支持 `keyword`、`category`、`minProfitRate` 三个条件组合筛选。
- 利润率筛选基于后端增强后的 `profitRatePercent` 字段完成，接口返回结果继续保留 `profit`、`profitRate`、`profitRatePercent`、`riskLevel`、`competitionLevel` 等字段。
- 新增 `client/src/components/ProfitFilter.jsx`，使用 `select` 提供全部、利润率大于 20%、30%、40% 四个选项。
- 在 `client/src/services/api.js` 中扩展 `getProducts({ keyword, category, minProfitRate })`，继续使用 `URLSearchParams` 拼接非空参数。
- 在 `ProductsPage` 中新增 `minProfitRate` 状态，并让搜索、类目筛选、利润率筛选、重置筛选都走同一套商品请求流程。
- 更新商品列表页空状态文案：没有找到符合条件的商品，请尝试更换关键词、类目或利润率条件。
- 小范围补充 `ProfitFilter` 样式，让它和 `SearchInput`、`CategoryFilter` 保持在同一个筛选区域内。

### 修改了哪些文件
- `server/routes/products.js`
- `client/src/components/ProfitFilter.jsx`
- `client/src/services/api.js`
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:3000/api/products?minProfitRate=20`
  - `http://localhost:3000/api/products?minProfitRate=30`
  - `http://localhost:3000/api/products?minProfitRate=40`
  - `http://localhost:5173/products`

### 如何测试
- 后端接口测试：
  - `http://localhost:3000/api/products?minProfitRate=20`
  - `http://localhost:3000/api/products?minProfitRate=30`
  - `http://localhost:3000/api/products?minProfitRate=40`
  - `http://localhost:3000/api/products?category=车载支架&minProfitRate=30`
  - `http://localhost:3000/api/products?keyword=直播&category=直播支架&minProfitRate=20`
  - 使用不存在的关键词组合测试空结果，确认返回 `[]`。
- 前端页面测试：
  - 打开 `http://localhost:5173/products`，确认首次显示全部商品。
  - 选择利润率大于 20%、30%、40%，确认商品列表会重新请求。
  - 先选择类目，再选择利润率，确认两个条件可以组合。
  - 输入关键词后点击搜索，确认会结合当前类目和利润率一起筛选。
  - 使用无结果组合时，确认显示空状态文案。
  - 点击“重置筛选”，确认 keyword、category、minProfitRate 都清空，并恢复全部商品。

### 本次验证结果
- `client` 执行 `npm run lint` 通过。
- `client` 执行 `npm run build` 通过。
- 使用临时 3100 端口挂载 `productsRouter` 验证后端筛选逻辑：
  - `minProfitRate=20` 返回 20 条。
  - `minProfitRate=30` 返回 20 条。
  - `minProfitRate=40` 返回 20 条。
  - `category=车载支架&minProfitRate=30` 返回 4 条。
  - `keyword=直播&category=直播支架&minProfitRate=20` 返回 4 条。
  - 不存在关键词组合返回 0 条。
- 随机检查筛选结果，确认仍然包含利润、利润率、风险等级、竞争等级等增强字段。

### 遇到的问题和解决方式
- 问题 1：后端真实计算里 `profitRate` 是小数，`profitRatePercent` 才是 20、30、40 这种百分比数字。
- 解决方式：先执行 `enrichProductMetrics(product)` 得到增强字段，再用 `profitRatePercent >= minProfitRate` 做筛选。
- 问题 2：临时后端验证第一次从项目根目录启动，Node 没有找到 `server/node_modules` 中的 `express`。
- 解决方式：改为从 `server` 目录启动临时测试服务，验证通过。
- 问题 3：当前 mock 商品的利润率整体都高于 40%，所以 20%、30%、40% 三档返回数量暂时一致。
- 解决方式：保持数据不做 Day 17 之外的调整，只验证筛选条件、组合查询和空结果流程正确。

### 今日重点理解知识点
- 为什么接口参数传的是 `20`、`30`、`40`，后端筛选时要使用 `profitRatePercent`，而不是直接拿小数形式的 `profitRate` 比较。
- 为什么利润率筛选要放在 `enrichProductMetrics(product)` 之后，因为原始 JSON 中没有后端计算出来的 `profitRatePercent`。
- `ProductsPage -> getProducts({ keyword, category, minProfitRate }) -> /api/products?keyword=xxx&category=xxx&minProfitRate=30 -> productsRouter -> ProductGrid` 这条组合筛选数据流。
- 为什么 `ProfitFilter` 只负责 UI，把真正的请求逻辑交给页面和 `services/api.js`。

### 明日计划
- 进入 Day 18，开始实现商品排序功能。
- 继续保持后端负责真实排序和筛选，前端负责收集条件并展示结果。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 17 记录

## Day 18 - 2026-05-18：排序功能

### 今日完成内容
- 在 `server/utils/productMetrics.js` 中新增了 `calculateRecommendationScore(product)`，基于利润率、月销量、评分和竞争指数计算简单推荐评分。
- 在 `enrichProductMetrics(product)` 中统一附加 `recommendationScore` 字段，保证商品列表、详情和排序都能拿到同一套增强字段。
- 在 `server/routes/products.js` 中为 `GET /api/products` 增加了 `sort` 查询参数支持。
- 后端排序支持 `profitRateDesc`、`monthlySalesDesc`、`ratingDesc`、`competitionScoreAsc`、`recommendationScoreDesc`。
- 后端处理顺序为：先按 `keyword` 筛选，再按 `category` 筛选，再补充商品增强字段，再按 `minProfitRate` 筛选，最后根据 `sort` 排序。
- 排序前使用 `[...products]` 复制数组，避免直接修改筛选结果数组。
- 新增 `client/src/components/SortSelect.jsx`，使用 `select` 提供默认排序、利润率、月销量、评分、竞争指数和推荐评分排序选项。
- 在 `client/src/services/api.js` 中扩展 `getProducts({ keyword, category, minProfitRate, sort })`，继续使用 `URLSearchParams` 拼接非空参数。
- 在 `ProductsPage` 中新增 `sort` 状态，并让关键词、类目、利润率和排序可以组合请求。
- 重置筛选时会同时清空 `keyword`、`category`、`minProfitRate` 和 `sort`。
- 在 `client/src/App.css` 中补充 `SortSelect` 样式，让排序下拉框与现有筛选工具栏风格一致。

### 修改了哪些文件
- `server/utils/productMetrics.js`
- `server/routes/products.js`
- `client/src/components/SortSelect.jsx`
- `client/src/services/api.js`
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:3000/api/products?sort=profitRateDesc`
  - `http://localhost:3000/api/products?sort=monthlySalesDesc`
  - `http://localhost:3000/api/products?sort=ratingDesc`
  - `http://localhost:3000/api/products?sort=competitionScoreAsc`
  - `http://localhost:3000/api/products?sort=recommendationScoreDesc`
  - `http://localhost:5173/products`

### 如何测试
- 后端接口测试：
  - `http://localhost:3000/api/products?sort=profitRateDesc`
  - `http://localhost:3000/api/products?sort=monthlySalesDesc`
  - `http://localhost:3000/api/products?sort=ratingDesc`
  - `http://localhost:3000/api/products?sort=competitionScoreAsc`
  - `http://localhost:3000/api/products?sort=recommendationScoreDesc`
  - `http://localhost:3000/api/products?category=车载支架&sort=profitRateDesc`
  - `http://localhost:3000/api/products?keyword=直播&category=直播支架&minProfitRate=20&sort=ratingDesc`
- 前端页面测试：
  - 打开 `http://localhost:5173/products`。
  - 切换不同排序方式，确认商品列表会重新请求接口。
  - 组合关键词、类目、利润率和排序条件，确认结果仍然正确。
  - 点击“重置筛选”，确认恢复默认商品列表。
  - 检查商品卡片原有利润率、竞争指数、评分等字段仍然正常显示。

### 本次验证结果
- `client` 执行 `npm run lint` 通过。
- `client` 执行 `npm run build` 通过。
- 使用临时 3100 端口挂载当前 `productsRouter` 验证后端接口：
  - `sort=profitRateDesc` 首条为 `便携旅行卡片式手机支架`。
  - `sort=monthlySalesDesc` 首条为 `迷你口袋折叠手机支架`。
  - `sort=ratingDesc` 首条为评分最高商品之一 `铝合金升降桌面手机支架`。
  - `sort=competitionScoreAsc` 首条为 `便携旅行卡片式手机支架`。
  - `sort=recommendationScoreDesc` 首条为 `便携旅行卡片式手机支架`。
  - `category=车载支架&sort=profitRateDesc` 返回 4 条车载支架商品。
  - `keyword=直播&category=直播支架&minProfitRate=20&sort=ratingDesc` 返回 4 条直播支架商品。
- 使用临时 3101 端口做排序断言验证：
  - `profitRateDesc` 通过。
  - `monthlySalesDesc` 通过。
  - `ratingDesc` 通过。
  - `competitionScoreAsc` 通过。
  - `recommendationScoreDesc` 通过。

### 遇到的问题和解决方式
- 问题 1：当前项目还没有 `recommendationScore` 字段。
- 解决方式：在已有指标工具 `productMetrics.js` 中新增一个简单评分，使用利润率、月销量、评分和低竞争优势四个容易解释的指标，不提前实现 Day 31 的复杂推荐算法。
- 问题 2：本机 `3000` 端口已有旧后端进程，不能直接代表本次代码。
- 解决方式：不关闭现有进程，临时在 `3100` 和 `3101` 端口挂载当前路由完成隔离验证。

### 今日重点理解知识点
- 为什么排序要放在筛选之后：用户想要的是“当前筛选结果里的排序”，不是先把全部商品排序后再筛。
- 为什么 `sort()` 前要先用 `[...products]` 复制数组，因为 `sort()` 会原地修改数组。
- 为什么 `SortSelect` 只负责 UI，不直接请求接口：请求逻辑统一放在 `ProductsPage` 和 `services/api.js` 中，组件更容易复用。
- `ProductsPage -> getProducts({ keyword, category, minProfitRate, sort }) -> /api/products?...&sort=xxx -> productsRouter -> ProductGrid` 这条排序数据流。

### 明日计划
- 进入 Day 19，考虑把搜索、筛选、排序整合成统一的 `ProductFilters` 组件，让 `ProductsPage` 更清晰。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 18 记录

## Day 19 - 2026-05-19：整合 ProductFilters

### 今日完成内容
- 新增 `client/src/components/ProductFilters.jsx`，把搜索框、类目筛选、利润率筛选、排序下拉框和清空按钮整合成统一筛选工具栏。
- `ProductFilters` 继续复用已有的 `SearchInput`、`CategoryFilter`、`ProfitFilter`、`SortSelect`，自身只负责筛选 UI 和事件转发，不直接请求接口。
- 在 `ProductsPage` 中使用统一的 `filters` 状态管理 `keyword`、`category`、`minProfitRate`、`sort`。
- 保留 `ProductsPage` 中的商品请求逻辑，通过 `loadProducts(filters)` 调用 `getProducts(filters)`。
- 搜索按钮和 Enter 会用当前 `filters` 请求商品；切换类目、利润率、排序会立即带上最新条件请求商品。
- 新增“清空筛选”按钮，点击后重置四个筛选条件，并重新加载全部商品。
- 小范围整理筛选工具栏样式，把原来的分散 toolbar 样式调整为 `product-filters` 语义类名。

### 修改了哪些文件
- `client/src/components/ProductFilters.jsx`
- `client/src/pages/ProductsPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 如何运行
- 后端：
  - `cd server`
  - `npm start`
- 前端：
  - `cd client`
  - `npm run dev`
- 访问：
  - `http://localhost:5173/products`

### 如何测试
- 打开 `http://localhost:5173/products`，确认商品列表首次加载全部商品。
- 输入“车载”“磁吸”“折叠”“直播”等关键词，点击“搜索”或按 Enter，确认商品列表刷新。
- 在关键词基础上切换类目，确认 `keyword + category` 可以组合使用。
- 继续选择利润率筛选，确认 `keyword + category + minProfitRate` 可以组合使用。
- 切换排序方式，确认会按当前筛选结果重新排序。
- 点击“清空筛选”，确认搜索框、类目、利润率、排序全部恢复默认，并重新显示全部商品。
- 使用无结果组合，确认空状态正常显示。
- 关闭后端后刷新页面，确认错误状态仍然正常显示。

### 本次验证结果
- `client` 执行 `npm run lint` 通过。
- `client` 执行 `npm run build` 通过。

### 遇到的问题和解决方式
- 问题 1：如果在 `useEffect` 中直接调用会同步 `setState` 的 `loadProducts`，新的 React Hooks lint 规则会报错。
- 解决方式：首次加载保留在 `useEffect` 内部的异步函数中完成；用户主动搜索、切换筛选和清空筛选继续走 `loadProducts(filters)`。
- 问题 2：搜索输入框是“点击搜索后请求”，而类目、利润率、排序是“切换后立即请求”。
- 解决方式：`ProductFilters` 内部区分事件：输入关键词只更新 `filters.keyword`，点击搜索才触发 `onSearch`；下拉框变化会先更新最新 `filters`，再立即触发 `onSearch(nextFilters)`。

### 今日重点理解知识点
- `ProductFilters` 是“筛选 UI 组合组件”，负责把多个小控件组合起来，并把最新筛选条件通知父组件。
- `ProductsPage` 是“数据请求页面组件”，负责保存 `filters`、请求商品、处理 loading/error/empty/success 状态和渲染商品列表。
- `filters` 的流动方向是：`ProductsPage filters` 传给 `ProductFilters`，用户操作后 `ProductFilters` 调用 `onFiltersChange(nextFilters)` 更新父组件状态，需要请求时再调用 `onSearch(nextFilters)`，最后 `ProductsPage` 调用 `getProducts(nextFilters)` 请求后端。
- 组件拆分的关键不是把代码拆得越碎越好，而是让 UI 事件收集和数据请求职责分开。

### 明日计划
- 进入 Day 20，集中测试搜索、类目、利润率和排序的组合逻辑。
- 重点检查空状态、错误状态、组合条件边界和页面体验是否稳定。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 19 记录

## Day 20 - 2026-05-20：筛选功能复盘

### 今日完成内容
- 复查了 `ProductsPage`、`ProductFilters`、`services/api.js` 和后端 `server/routes/products.js` 的搜索、筛选、排序数据流。
- 使用临时后端服务测试了组合查询，避免被本机 3000 端口上的旧进程影响。
- 验证了 `keyword + category`、`category + minProfitRate`、`sort + keyword`、`keyword + category + minProfitRate + sort`、清空筛选、空结果、请求失败等核心场景。
- 确认 `getProducts` 使用 `URLSearchParams` 拼接查询参数，且空参数不会拼接到 URL 中。
- 确认后端 `/api/products` 先筛选再排序，排序前会复制数组，不直接修改原数组。
- 确认筛选和排序后的商品仍然保留 `profit`、`profitRate`、`profitRatePercent`、`riskLevel`、`competitionLevel` 等增强字段。
- 为 `ProductsPage` 增加最新请求编号，避免快速切换筛选条件时旧请求结果覆盖新请求结果。

### 修改了哪些文件
- `client/src/pages/ProductsPage.jsx`
- `docs/DAILY_LOG.md`

### 测试了哪些组合
- `keyword=磁吸&category=磁吸支架`，返回 3 条。
- `category=车载支架&minProfitRate=30`，返回 4 条。
- `keyword=直播&sort=ratingDesc`，返回 4 条，并确认评分从高到低。
- `keyword=直播&category=直播支架&minProfitRate=30&sort=profitRateDesc`，返回 4 条，并确认利润率从高到低。
- `keyword=不存在的关键词`，返回空数组 `[]`。
- 无查询参数访问 `/api/products`，返回全部 20 条商品。
- 模拟 `fetch` 抛出连接错误，确认 `getProducts` 返回“无法连接到后端服务，请确认 http://localhost:3000 已启动”，页面会进入 error 状态展示。

### 修复了哪些 bug
- 修复了一个潜在请求竞态问题：用户快速切换关键词、类目、利润率或排序时，较早发出的慢请求可能晚于新请求返回，导致页面显示旧筛选结果。
- 解决方式是在 `ProductsPage` 中使用 `useRef` 保存最新请求编号，只有最新一次请求可以更新 `products`、`error` 和 `loading` 状态。

### 商品列表筛选当前状态
- `ProductFilters` 只负责筛选 UI 和事件转发，不直接请求接口。
- `ProductsPage` 统一管理 `filters`、`products`、`loading`、`error` 状态。
- 搜索按钮或 Enter 会按当前条件请求接口。
- 类目、利润率和排序切换后会带上最新筛选条件重新请求接口。
- 清空筛选会重置 `keyword`、`category`、`minProfitRate`、`sort`，并重新加载全部商品。
- loading、error、empty、success 四种页面状态都保留在 `ProductsPage` 中统一判断。

### 测试方式
- 运行前端检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`
- 运行后端组合断言：
  - 临时挂载 `productsRouter` 到随机本地端口。
  - 使用 `fetch` 请求不同查询参数组合。
  - 断言返回数组数量、排序顺序、类目、利润率和增强字段。
- 页面手动验证地址：
  - `http://localhost:5173/products`

### 遇到的问题和解决方式
- 问题 1：第一次临时脚本直接写中文查询值时，PowerShell 管道里的中文字面量影响了测试判断。
- 解决方式：测试脚本改用 Unicode escape 构造中文参数，并通过 `URLSearchParams` 拼接查询字符串，避免误判业务代码。
- 问题 2：前端快速切换筛选条件时存在旧请求覆盖新请求的潜在风险。
- 解决方式：增加最新请求编号，只允许最后一次请求更新页面状态。

### 今日重点理解知识点
- 组合筛选的数据流：`ProductFilters` 收集条件，`ProductsPage` 保存 `filters` 并调用 `getProducts(filters)`，`api.js` 用 `URLSearchParams` 拼接查询参数，后端 `/api/products` 先筛选再排序，最后返回增强后的商品数组。
- 为什么利润率筛选要比较 `profitRatePercent`，因为前端选择的是 `20 / 30 / 40` 这种百分比数字，而不是 `0.2 / 0.3 / 0.4` 的小数。
- 为什么排序要放在筛选之后：用户需要的是“当前筛选结果内部排序”。
- 为什么请求状态需要防止竞态：真实页面里用户操作可能很快，旧请求晚返回时不能覆盖新结果。

### 明日计划
- 进入 Day 21，开始初始化候选池数据文件和 JSON 文件读写工具。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 20 记录

## Day 21 - 2026-05-22：初始化收藏数据

### 今日完成内容
- 创建了 `server/data/favorites.json`，初始内容为一个空数组 `[]`。
- 创建了 `server/utils/fileStore.js`，用于封装通用 JSON 文件读写逻辑。
- 实现了 `readJsonFile(filePath)`，可以读取指定 JSON 文件并返回 JavaScript 数据。
- 实现了 `writeJsonFile(filePath, data)`，可以把 JavaScript 数据格式化写入指定 JSON 文件。
- 更新了 `README.md`，将项目状态同步为第四阶段：候选池与 JSON 持久化。
- 本次只完成候选池数据存储准备，没有实现收藏接口、前端收藏按钮或候选池 UI。

### 修改了哪些文件
- `server/data/favorites.json`
- `server/utils/fileStore.js`
- `README.md`
- `docs/DAILY_LOG.md`

### 测试方式
- 使用 Node 临时脚本导入 `readJsonFile` 和 `writeJsonFile`。
- 读取 `server/data/favorites.json`，确认返回数组且长度为 `0`。
- 临时写入测试 JSON 文件，再读取回来确认内容一致。
- 删除临时测试文件，确认没有留下无用测试代码。
- 回归检查现有后端接口：
  - `http://localhost:3000/api/health`
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/dashboard`

### 遇到的问题和解决方式
- 问题 1：当前项目后端使用 ES Module。
- 解决方式：`fileStore.js` 使用 `import/export`，不混用 `require/module.exports`。
- 问题 2：今天只需要准备文件读写工具，不能提前实现收藏业务。
- 解决方式：只新增 `favorites.json` 和通用工具函数，不注册 `/api/favorites` 路由，不修改前端页面。

### 今日重点理解知识点
- `favorites.json` 是后续候选池功能的本地 JSON 存储文件，今天先用空数组表示“还没有收藏商品”。
- `readJsonFile(filePath)` 负责读取 UTF-8 文件内容，再通过 `JSON.parse` 转成 JavaScript 数据。
- `writeJsonFile(filePath, data)` 负责通过 `JSON.stringify(data, null, 2)` 把 JavaScript 数据格式化成 JSON 文本，再用 UTF-8 写入文件。
- `fileStore.js` 是通用工具，不写死 `favorites.json`，后续也可以复用到其他 JSON 文件读写场景。

### 明日计划
- 进入 Day 22，实现 `GET /api/favorites`。
- 读取 `favorites.json` 中的收藏商品 id，并关联 `products.json` 返回候选池商品列表。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 21 记录

## Day 22 - 2026-05-22：获取候选池接口

### 今日完成内容
- 创建了 `server/routes/favorites.js`。
- 实现了 `GET /api/favorites`，用于返回候选池中的收藏商品列表。
- 使用 Day 21 封装的 `readJsonFile(filePath)` 读取 `server/data/favorites.json` 和 `server/data/products.json`。
- 根据 `favorites.json` 中保存的商品 `id`，从 `products.json` 中关联对应商品详情。
- 返回商品前统一调用 `enrichProductMetrics(product)`，保证候选池商品也包含 `profit`、`profitRate`、`profitRatePercent`、`riskLevel`、`competitionLevel`、`recommendationScore` 等增强字段。
- 当 `favorites.json` 是空数组 `[]` 时，接口正常返回 `[]`。
- 当某个收藏 `id` 找不到对应商品时，会忽略该 `id`，不会让接口崩溃。
- 在 `server/app.js` 中注册了 `/api/favorites` 路由。
- 本次没有实现 `POST /api/favorites` 和 `DELETE /api/favorites/:id`，没有修改前端页面。

### 修改了哪些文件
- `server/routes/favorites.js`
- `server/app.js`
- `docs/DAILY_LOG.md`

### 测试方式
- 使用临时 Express 服务挂载当前路由到随机端口，避免被本机已有 `3000` 端口进程影响。
- 空候选池测试：
  - 保持 `server/data/favorites.json` 为 `[]`。
  - 请求 `GET /api/favorites`。
  - 验证返回 `[]`。
- 有收藏商品测试：
  - 临时把 `server/data/favorites.json` 写成 `[1, 2, 999]`。
  - 请求 `GET /api/favorites`。
  - 验证返回 2 条商品，商品 `id` 为 `1` 和 `2`。
  - 验证找不到的 `999` 被忽略。
  - 验证返回商品包含 `profit`、`profitRatePercent`、`riskLevel`、`competitionLevel` 等增强字段。
  - 测试完成后已把 `favorites.json` 恢复为 `[]`。
- 回归检查现有接口：
  - `GET /api/health`
  - `GET /api/products`
  - `GET /api/dashboard`

### 遇到的问题和解决方式
- 问题 1：候选池只保存商品 `id`，但前端后续展示需要完整商品信息和利润、风险等增强字段。
- 解决方式：接口先读取收藏 `id`，再读取商品列表，用 `Map` 建立 `id -> 商品对象` 的映射，最后对匹配到的商品调用 `enrichProductMetrics(product)`。
- 问题 2：测试数据需要临时写入 `favorites.json`，但不应该把测试收藏提交到项目里。
- 解决方式：测试完成后立即恢复 `favorites.json` 为 `[]`。

### 今日重点理解知识点
- `favorites.json` 只负责保存候选池关系，也就是“哪些商品被收藏了”。
- `products.json` 才负责保存完整商品详情，避免同一份商品数据在多个文件中重复维护。
- `Map` 适合做按 `id` 快速查找：先把全部商品变成 `id -> product`，再根据收藏 `id` 取出商品详情。
- 候选池接口也要复用 `enrichProductMetrics`，这样 `/api/products` 和 `/api/favorites` 返回的商品计算字段保持一致。

### 明日计划
- 进入 Day 23，实现 `POST /api/favorites`。
- 支持添加候选商品，并处理商品不存在和重复收藏两种情况。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 22 记录

## Day 23 - 2026-05-22：添加候选商品接口

### 今日完成内容
- 在 `server/routes/favorites.js` 中实现了 `POST /api/favorites`。
- 支持从请求体中读取 `productId`，例如 `{ "productId": 1 }`。
- 增加了 `productId` 校验：缺失、空值、非数字、非整数和小于等于 0 的值都会返回 `400`。
- 读取 `server/data/products.json`，判断传入的商品是否真实存在。
- 商品不存在时返回 `404`，避免把无效商品 id 写入候选池。
- 读取 `server/data/favorites.json`，判断商品是否已经在候选池中。
- 重复收藏时返回 `409`，并提示“该商品已在候选池中。”
- 未重复时，只把商品 `id` 写入 `favorites.json`，继续保持简单 id 数组格式。
- 添加成功后返回成功信息和当前添加的商品详情，商品详情包含 `profit`、`profitRate`、`profitRatePercent`、`riskLevel`、`competitionLevel` 等增强字段。
- 确认 `server/app.js` 已有 `app.use(express.json())`，不需要重复添加。
- 在 `server/app.js` 的接口提示中补充了 `POST /api/favorites`。

### 修改了哪些文件
- `server/routes/favorites.js`
- `server/app.js`
- `docs/DAILY_LOG.md`

### 测试方式
- 使用临时 Express 服务挂载当前 `favoritesRouter`，避免被本机已有 `3000` 端口进程影响。
- 添加存在的商品：
  - 请求 `POST /api/favorites`，请求体 `{ "productId": 1 }`。
  - 验证返回 `201`，并且返回商品详情包含增强字段。
  - 验证 `favorites.json` 中写入 `1`。
- 重复添加同一个商品：
  - 再次请求 `POST /api/favorites`，请求体 `{ "productId": 1 }`。
  - 验证返回 `409`，并提示该商品已在候选池中。
  - 验证 `favorites.json` 不会重复写入 `1`。
- 添加不存在的商品：
  - 请求体 `{ "productId": 999999 }`。
  - 验证返回 `404`，提示商品不存在。
- `productId` 非法：
  - 请求体 `{ "productId": "abc" }`。
  - 验证返回 `400`，提示 `productId` 不合法。
- 回归测试 `GET /api/favorites`：
  - `favorites.json` 为空时返回 `[]`。
  - 有收藏 id 时能返回当前候选池商品列表。

### 遇到的问题和解决方式
- 问题 1：POST 请求需要读取 `req.body`，如果没有 `express.json()` 会读不到 JSON 请求体。
- 解决方式：检查 `server/app.js`，确认已经存在 `app.use(express.json())`，因此不重复添加。
- 问题 2：候选池写入时既要能保存收藏关系，又不能造成商品详情重复维护。
- 解决方式：`favorites.json` 继续只保存商品 `id`，返回详情时再从 `products.json` 关联商品，并复用 `enrichProductMetrics(product)` 生成增强字段。
- 问题 3：路由中有多个数据文件路径。
- 解决方式：在 `favorites.js` 中增加简单的 `getDataFilePath(fileName)`，集中处理当前路由所需的数据文件路径。

### 今日重点理解知识点
- `POST /api/favorites` 的职责是“建立收藏关系”，不是保存完整商品对象。
- `productId` 需要先通过 `Number()` 转成数字，再用 `Number.isInteger()` 判断是否是合法整数。
- 判断商品是否存在时，应该读取 `products.json`，用 `find()` 查找 `product.id === productId`。
- 判断重复收藏时，应该读取 `favorites.json`，用 `includes(productId)` 判断 id 是否已经存在。
- 写入收藏时使用 `[...favoriteIds, productId]` 生成新数组，再调用 `writeJsonFile()` 写回文件。

### 明日计划
- 进入 Day 24，实现 `DELETE /api/favorites/:id`。
- 支持从候选池删除指定商品，并保持 `favorites.json` 持久化更新。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 23 记录

## Day 24 - 2026-05-23：删除候选商品接口

### 今日完成内容
- 在 `server/routes/favorites.js` 中实现了 `DELETE /api/favorites/:id`。
- 支持从 URL 参数 `req.params.id` 中读取要删除的 `productId`，例如 `DELETE /api/favorites/1`。
- 复用已有 `parseProductId()` 校验逻辑，非法 id 会返回 `400`。
- 使用 `readJsonFile(favoritesFilePath)` 读取 `server/data/favorites.json`。
- 使用 `favoriteIds.includes(productId)` 判断商品是否已经在候选池中。
- 当商品不在候选池中时返回 `404`，并提示“该商品不在候选池中，无法删除。”
- 当商品存在于候选池中时，使用 `filter()` 删除对应 id，并通过 `writeJsonFile()` 写回 `favorites.json`。
- 删除后 `favorites.json` 继续保持商品 id 数组格式，没有改成对象数组。
- 在 `server/app.js` 的接口提示中补充了 `DELETE /api/favorites/:id`。

### 修改了哪些文件
- `server/routes/favorites.js`
- `server/app.js`
- `docs/DAILY_LOG.md`

### 测试方式
- 使用临时 Express 服务挂载当前 `favoritesRouter`，避免被本机已有 `3000` 端口进程影响。
- 添加商品到候选池：
  - 请求 `POST /api/favorites`，请求体 `{ "productId": 1 }`。
  - 验证返回添加成功，且 `favorites.json` 中存在 `1`。
- 删除已收藏商品：
  - 请求 `DELETE /api/favorites/1`。
  - 验证返回删除成功，且 `favorites.json` 中不再包含 `1`。
- 删除后查看候选池：
  - 请求 `GET /api/favorites`。
  - 验证已删除商品不再出现在候选池商品列表中。
- 删除不存在于候选池的商品：
  - 请求 `DELETE /api/favorites/999999`。
  - 验证返回 `404`，并提示该商品不在候选池中。
- 非法 `productId`：
  - 请求 `DELETE /api/favorites/abc`。
  - 验证返回 `400`，并提示 `productId` 不合法。
- 回归测试已有接口：
  - `GET /api/favorites` 仍然可以返回候选池商品列表。
  - `POST /api/favorites` 仍然可以添加候选商品。

### 遇到的问题和解决方式
- 问题 1：删除接口的 `productId` 来自 URL，而 POST 接口的 `productId` 来自请求体。
- 解决方式：继续复用 `parseProductId()`，只把输入从 `req.body?.productId` 换成 `req.params.id`，保证两个接口的校验标准一致。
- 问题 2：删除时不能改变 `favorites.json` 的数据格式。
- 解决方式：只对 id 数组使用 `filter()` 生成新的 id 数组，再通过 `writeJsonFile()` 写回文件。
- 问题 3：测试会临时改动 `favorites.json`。
- 解决方式：测试前记录原始收藏 id，测试完成后恢复，避免把测试数据留在项目中。

### 今日重点理解知识点
- `DELETE /api/favorites/:id` 的职责是“删除收藏关系”，不是删除商品本身。
- `req.params.id` 可以读取 URL 路径里的动态参数，例如 `/api/favorites/1` 中的 `1`。
- `Number()` 和 `Number.isInteger()` 可以把字符串参数校验成合法正整数。
- `includes(productId)` 用来判断某个商品 id 是否已经在候选池中。
- `filter((favoriteId) => favoriteId !== productId)` 会创建一个不包含目标 id 的新数组。
- `writeJsonFile(favoritesFilePath, nextFavoriteIds)` 负责把删除后的候选池 id 数组持久化到 `favorites.json`。

### 明日计划
- 进入 Day 25，实现前端收藏按钮。
- 在商品列表和商品详情页接入 `POST /api/favorites`，让用户可以从页面加入候选池。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 24 记录

## Day 25 - 2026-05-23：前端收藏按钮

### 今日完成内容
- 在 `client/src/services/api.js` 中新增 `addFavorite(productId)`，用于请求 `POST /api/favorites`。
- 在 `ProductCard` 商品卡片中添加“加入候选池”按钮。
- 在 `ProductDetailPage` 商品详情页中添加“加入候选池”按钮。
- 收藏成功后会显示后端返回的成功提示，例如“商品已成功添加到候选池。”。
- 重复收藏时不会让页面崩溃，会显示后端返回的提示“该商品已在候选池中。”。
- 收藏请求过程中会禁用按钮，避免连续点击重复提交。
- 调整了商品卡片结构，让详情跳转 `Link` 和收藏按钮分开，点击收藏按钮不会触发详情页跳转。

### 修改了哪些文件
- `client/src/services/api.js`
- `client/src/components/ProductCard.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 启动前端：
  - `cd client`
  - `npm run dev`
- 访问 `http://localhost:5173/products`：
  - 点击任意商品卡片里的“加入候选池”，确认有成功提示。
  - 再次点击同一个商品的“加入候选池”，确认显示重复收藏提示。
  - 确认点击收藏按钮不会跳转详情页。
  - 点击商品卡片主体，确认仍然可以进入详情页。
- 访问 `http://localhost:5173/products/1`：
  - 点击详情页里的“加入候选池”，确认有成功提示。
  - 再次点击，确认重复收藏不会崩溃。
- 访问 `http://localhost:3000/api/favorites`：
  - 确认从列表页或详情页收藏后的商品出现在候选池接口结果中。
  - 确认重复收藏不会在 `favorites.json` 中重复写入同一个 `productId`。

### 遇到的问题和解决方式
- 问题 1：`ProductCard` 原来整体由 `Link` 包裹，如果直接把按钮放进 `Link`，点击按钮可能触发详情跳转。
- 解决方式：把卡片外层改为 `article.product-card`，让商品主体内容单独作为 `Link`，收藏按钮放在 `Link` 外面。
- 问题 2：前端需要显示后端返回的 409 重复收藏提示。
- 解决方式：调整 `requestJson` 的错误处理，让接口错误时能结合状态码文案和后端 JSON 中的 `message` 字段。

### 今日重点理解知识点
- `addFavorite(productId)` 是前端服务层函数，页面组件不直接写 `fetch` 细节。
- `POST /api/favorites` 的请求体是 `{ productId }`，后端只保存商品 id，不保存完整商品对象。
- 收藏按钮需要独立处理 loading、message 和错误状态，不能影响页面原有数据加载状态。
- 商品卡片里“跳详情”和“加入候选池”是两个不同用户动作，结构上也应该分开。

### 明日计划
- 进入 Day 26，实现 `FavoritesPage` 候选池页面。
- 请求 `GET /api/favorites` 展示候选池商品列表，并接入删除收藏能力。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 25 记录

## Day 26 - 2026-05-25：FavoritesPage 候选池页面

### 今日完成内容
- 在 `client/src/services/api.js` 中新增 `getFavorites()`，用于请求 `GET /api/favorites`。
- 在 `client/src/services/api.js` 中新增 `removeFavorite(productId)`，用于请求 `DELETE /api/favorites/:id`。
- 完成 `FavoritesPage` 候选池页面真实业务实现。
- 页面加载时请求候选池接口，并展示收藏商品列表。
- 支持 `loading / error / empty / success` 四种页面状态。
- 候选池为空时显示“候选池暂无商品，请先从商品列表添加。”。
- 每个候选商品展示图片、商品名称、类目、Amazon 售价、1688 成本、利润率、评分和竞争指数。
- 支持点击候选商品内容进入 `/products/:id` 商品详情页。
- 支持点击“取消收藏”，调用 `removeFavorite(product.id)` 删除收藏。
- 删除成功后，使用 `filter()` 立即更新当前页面列表。
- 删除失败时，在页面中显示错误提示。

### 修改了哪些文件
- `client/src/services/api.js`
- `client/src/pages/FavoritesPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 启动前端：
  - `cd client`
  - `npm run dev`
- 访问候选池页面：
  - `http://localhost:5173/favorites`
- 联动测试：
  - 打开 `http://localhost:5173/products`
  - 点击任意商品的“加入候选池”
  - 打开 `http://localhost:5173/favorites`
  - 确认商品出现在候选池中
  - 点击商品内容，确认可以进入商品详情页
  - 点击“取消收藏”，确认页面列表立即更新
  - 刷新候选池页面，确认被删除商品不会再次出现
  - 检查 `server/data/favorites.json`，确认对应 `productId` 已被删除
- 前端检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：`ProductCard` 已经带有“加入候选池”按钮，直接复用会让候选池页面出现错误操作。
- 解决方式：在 `FavoritesPage` 内部写轻量的 `FavoriteProductItem`，只保留候选池需要的展示、详情跳转和取消收藏能力。
- 问题 2：点击“取消收藏”不能触发商品详情跳转。
- 解决方式：把商品内容放在 `Link` 中，把“取消收藏”按钮放在 `Link` 外面，两个操作互不影响。
- 问题 3：删除成功后需要页面立即变化，同时刷新后仍然持久化。
- 解决方式：前端删除成功后用 `setFavorites(current => current.filter(...))` 更新页面；后端 `DELETE /api/favorites/:id` 已经负责写回 `favorites.json`，刷新后会从 JSON 文件重新读取最新结果。

### 今日重点理解知识点
- `getFavorites()` 是候选池列表读取函数，只负责请求 `GET /api/favorites`，并校验返回值必须是数组。
- `removeFavorite(productId)` 是删除收藏函数，只负责请求 `DELETE /api/favorites/:id`，并校验返回值必须是对象。
- `FavoritesPage` 中页面主数据状态是 `favorites`，请求状态是 `loading` 和 `error`，删除错误单独用 `removeError` 管理。
- 删除收藏后不需要重新刷新整个页面，可以先基于当前数组用 `filter()` 移除目标商品，让用户马上看到结果。
- 候选池页面的详情跳转使用 React Router 的 `Link` 指向 `/products/${product.id}`。

### 明日计划
- 进入 Day 27，安装并使用 Recharts。
- 创建基础图表组件，为后续 Dashboard 图表展示做准备。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 26 记录

## Day 27 - 2026-06-01：安装并使用 Recharts

### 今日完成内容
- 在 `client` 前端项目中安装了 `recharts`。
- 创建了 `client/src/components/BasicChart.jsx` 基础图表组件。
- 在 `BasicChart` 中使用固定测试数据展示手机支架类型数量。
- 使用了 `BarChart` 展示柱状图。
- 使用了 `PieChart` 展示饼图。
- 两个图表都使用 `ResponsiveContainer` 做宽度自适应。
- 两个图表都接入了 `Tooltip`，鼠标悬停时可以查看当前图表项数据。
- 在 `AnalysisPage` 中展示“选品分析图表”，今天只做测试图表，不对接真实 Dashboard 数据。
- 补充了图表卡片和图表区域基础样式。

### 修改了哪些文件
- `client/package.json`
- `client/package-lock.json`
- `client/src/components/BasicChart.jsx`
- `client/src/pages/AnalysisPage.jsx`
- `client/src/App.css`
- `client/vite.config.js`
- `docs/DAILY_LOG.md`

### 测试方式
- 启动前端：
  - `cd client`
  - `npm run dev`
- 访问 `http://localhost:5173/analysis`：
  - 确认页面可以正常打开。
  - 确认能看到基础柱状图和饼图。
  - 鼠标悬停图表项，确认 Tooltip 可以显示数据。
  - 调整浏览器宽度，确认图表容器宽度自适应。
- 回归访问其他页面：
  - `http://localhost:5173/`
  - `http://localhost:5173/products`
  - `http://localhost:5173/favorites`
- 前端检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：`ResponsiveContainer` 需要父容器有明确高度，否则图表可能显示不出来。
- 解决方式：给 `.basic-chart__chart-area` 设置 `height: 300px`，让 Recharts 有可计算的渲染空间。
- 问题 2：今天的目标是先熟悉 Recharts，不应该提前做复杂分析。
- 解决方式：测试数据直接写在 `BasicChart` 内部，暂时不请求接口、不改 Dashboard、不新增复杂封装。
- 问题 3：开发环境打开页面时出现空白页，浏览器控制台报错来自 Vite 预构建后的 `recharts.js`。
- 解决方式：在 `vite.config.js` 中通过 `optimizeDeps.exclude` 排除 `recharts`，让开发环境直接加载 Recharts 的 ESM 模块，避免预构建产物报错。
- 问题 4：安装 Recharts 后，`package-lock.json` 将 Vite 解析到了 `8.0.11`，本地启动开发服务时出现 `failed to load config`。
- 解决方式：把 `vite` 固定回项目原来的 `8.0.10`，减少 Day 27 对开发服务器版本的额外影响。
- 问题 5：`recharts@3.8.1` 在当前 Vite 开发环境中预构建后出现运行时报错，进入分析页会导致白屏。
- 解决方式：将 Recharts 固定为更稳定的 `2.15.4`，并清理 `node_modules/.vite` 后重新启动前端服务。
- 问题 6：图表库运行时报错时会影响整个页面渲染。
- 解决方式：在 `AnalysisPage` 中使用 `lazy` 和 `Suspense` 懒加载 `BasicChart`，让图表代码只在进入分析页时加载，降低对其他页面的影响。

### 今日重点理解知识点
- `BarChart` 适合对比不同手机支架类型的数量或指标高低。
- `PieChart` 适合观察不同类型在整体中的占比感觉。
- `ResponsiveContainer` 负责让图表跟随父容器尺寸变化，常用写法是 `width="100%" height="100%"`。
- `Tooltip` 是图表的悬停提示组件，可以让用户看到当前柱子或扇区对应的数据。
- Recharts 图表通常由外层图表组件、坐标轴、图形元素和交互组件组合出来。

### 明日计划
- 进入 Day 28，创建 Dashboard 利润率排行图。
- 使用 `GET /api/dashboard` 返回的 `topProfitProducts` 数据，把真实业务数据接入图表。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 27 记录

## Day 28 - 2026-06-02：Dashboard 利润率排行图

### 今日完成内容
- 创建了 `client/src/components/ProfitRankingChart.jsx`。
- 在 `ProfitRankingChart` 中使用 Recharts 的 `BarChart` 展示利润率排行。
- 图表使用 `ResponsiveContainer` 实现宽度自适应。
- 图表接入 `Tooltip`，悬停时可以看到完整商品名称和利润率。
- 组件接收 `topProfitProducts` 或 `products` 作为 props，不在组件内部请求接口。
- 在 `DashboardPage` 中使用 `/api/dashboard` 返回的 `topProfitProducts` 数据渲染利润率排行图。
- 保留 Dashboard 原有 4 个指标卡、loading 状态、error 状态和空数据状态。
- 为利润率排行图添加了卡片样式和空状态样式。

### 修改了哪些文件
- `client/src/components/ProfitRankingChart.jsx`
- `client/src/pages/DashboardPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 浏览器访问 `http://localhost:3000/api/dashboard`：
  - 确认返回数据包含 `topProfitProducts`。
  - 确认 `topProfitProducts` 中商品包含 `id`、`productName`、`profit`、`profitRate`、`profitRatePercent`。
- 启动前端：
  - `cd client`
  - `npm run dev`
- 浏览器访问 `http://localhost:5173/`：
  - 确认原有 Dashboard 指标卡正常显示。
  - 确认页面出现“利润率排行”柱状图。
  - 鼠标悬停柱子，确认 Tooltip 可以显示商品和利润率。
  - 调整浏览器宽度，确认图表宽度自适应。
- 前端检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：手机支架商品名称较长，横向柱状图如果直接显示完整名称会拥挤。
- 解决方式：图表使用横向柱状图，纵轴展示截断后的商品名，Tooltip 中保留完整商品名。
- 问题 2：接口可能优先返回 `profitRatePercent`，也可能只有 `profitRate` 小数字段。
- 解决方式：组件中先使用 `profitRatePercent`，如果没有则把 `profitRate * 100` 转成百分比。
- 问题 3：`ResponsiveContainer` 需要父容器高度，否则图表可能没有渲染空间。
- 解决方式：为 `.profit-ranking-chart__chart-area` 设置固定高度 `320px`。

### 今日重点理解知识点
- `DashboardPage` 负责请求 `/api/dashboard`，拿到数据后通过 props 传给图表组件。
- `ProfitRankingChart` 只负责展示数据，不负责请求接口，这样组件更容易复用和测试。
- `topProfitProducts` 来自后端 Dashboard 统计逻辑，由商品数据经过利润计算后按利润率排序得到。
- `profitRatePercent` 是已经计算好的百分比，适合直接展示；`profitRate` 是小数，需要乘以 `100` 后展示。

### 明日计划
- 进入 Day 29，创建类目分布图。
- 使用 `/api/dashboard` 返回的 `categoryDistribution` 数据展示手机支架类型分布。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 28 记录

## Day 29 - 2026-06-02：类目分布图

### 今日完成内容
- 创建了 `client/src/components/CategoryPieChart.jsx`。
- 在 `CategoryPieChart` 中使用 Recharts 的 `PieChart` 展示手机支架类型分布。
- 图表使用 `ResponsiveContainer` 实现宽度自适应。
- 图表接入 `Tooltip`，鼠标悬停扇区时可以看到对应类型和商品数量。
- 图表接入 `Legend`，方便识别不同手机支架类型。
- 组件接收 `categoryDistribution` 作为 props，不在组件内部请求接口。
- 兼容后端当前返回的 `{ category, count }` 数组格式，也兼容对象格式和 `{ name, value }` 数组格式。
- 在 `DashboardPage` 中使用 `/api/dashboard` 返回的 `categoryDistribution` 数据渲染手机支架类型分布饼图。
- 保留 Dashboard 原有 4 个指标卡、loading 状态、error 状态和 Day 28 的 `ProfitRankingChart`。
- 为类型分布饼图添加了和当前 Dashboard 风格一致的卡片样式和空状态样式。

### 修改了哪些文件
- `client/src/components/CategoryPieChart.jsx`
- `client/src/pages/DashboardPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 浏览器访问 `http://localhost:3000/api/dashboard`：
  - 确认返回数据包含 `categoryDistribution`。
  - 确认当前 `categoryDistribution` 是 `{ category, count }` 数组，可以表示不同手机支架类型的数量分布。
- 启动前端：
  - `cd client`
  - `npm run dev`
- 浏览器访问 `http://localhost:5173/`：
  - 确认 Dashboard 原有指标卡正常显示。
  - 确认“利润率排行”柱状图仍然正常显示。
  - 确认新增“手机支架类型分布”饼图。
  - 鼠标悬停饼图扇区，确认 Tooltip 可以显示类型和数量。
  - 调整浏览器宽度，确认图表宽度自适应。
- 前端检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：后端当前 `categoryDistribution` 不是对象格式，而是 `{ category, count }` 数组格式。
- 解决方式：在 `CategoryPieChart` 中增加 `normalizeCategoryDistribution()`，把数组格式转换为 Recharts 统一使用的 `{ name, value }` 格式。
- 问题 2：后续如果后端改成对象格式，组件可能因为字段不一致无法显示。
- 解决方式：组件同时兼容对象格式、`{ category, count }` 数组格式和 `{ name, value }` 数组格式。
- 问题 3：`ResponsiveContainer` 需要父容器有明确高度，否则饼图可能没有渲染空间。
- 解决方式：为 `.category-pie-chart__chart-area` 设置固定高度 `320px`。

### 今日重点理解知识点
- `DashboardPage` 负责请求 `/api/dashboard`，拿到数据后通过 props 传给图表组件。
- `CategoryPieChart` 只负责把传入的数据转换成图表需要的格式并展示，不负责请求接口。
- Recharts 的 `Pie` 通常需要 `dataKey="value"` 指定数值字段，用 `nameKey="name"` 指定名称字段。
- 后端统计格式 `{ category, count }` 更贴近业务语义，前端图表格式 `{ name, value }` 更贴近 Recharts 约定，所以中间需要做一次轻量转换。
- 空数据时先展示空状态，避免图表组件拿到无效数据后页面崩溃。

### 明日计划
- 进入 Day 30，完成 `AnalysisPage` 基础版。
- 展示高潜力商品、高风险商品、低竞争高利润商品和推荐理由。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 29 记录

## Day 30 - 2026-06-02：选品分析页基础版

### 今日完成内容
- 在 `AnalysisPage` 中请求 `GET /api/products` 商品数据。
- 完成选品分析页的 `loading / error / empty / success` 四种状态。
- 展示“高潜力商品”分析区块。
- 展示“高风险商品”分析区块。
- 展示“低竞争高利润商品”分析区块。
- 每个分析商品卡片展示商品名称、类目、利润率、竞争指数、风险等级、推荐评分和推荐理由。
- 每个分析商品卡片支持跳转到 `/products/:id` 商品详情页。
- 为分析页补充专用样式，让三个分析区块视觉上更容易区分。

### 修改了哪些文件
- `client/src/pages/AnalysisPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 测试方式
- 前端静态检查：
  - `cd client`
  - `npm run lint`
- 前端生产构建：
  - `cd client`
  - `npm run build`
- 页面联调测试：
  - 启动后端：`cd server && npm start`
  - 启动前端：`cd client && npm run dev`
  - 访问 `http://localhost:5173/analysis`
  - 确认页面能看到高潜力商品、高风险商品、低竞争高利润商品和推荐理由。
  - 点击分析卡片中的“查看商品详情”，确认可以进入 `/products/:id`。

### 遇到的问题和解决方式
- 问题 1：当前商品利润率普遍很高，如果直接使用 `profitRatePercent >= 30`，区分度不够。
- 解决方式：结合当前 mock 数据，把高潜力和低竞争高利润规则中的利润率阈值设为 `220%`，让页面更能体现分析筛选效果。
- 问题 2：`recommendationReason` 当前是字符串，但后续也可能调整成数组。
- 解决方式：在分析页中增加轻量格式化函数，兼容字符串和数组两种展示方式。
- 问题 3：同一商品可能同时属于高潜力和低竞争高利润。
- 解决方式：允许商品出现在多个分析区块中，因为不同区块代表不同业务视角。

### 今日重点理解知识点
- `AnalysisPage` 通过 `useEffect` 在页面加载时请求商品数据。
- `useMemo` 可以把基于商品列表计算出来的分析分组缓存起来，避免每次渲染都重复筛选。
- `filter()` 适合根据业务规则筛选商品，`sort()` 适合把更值得关注的商品排在前面，`slice()` 适合控制页面展示数量。
- 分析页不是简单列表，而是把同一批商品按不同业务问题分组展示。
- 推荐理由来自商品数据中的 `recommendationReason` 字段，前端只负责格式化和展示。

### 明日计划
- 进入 Day 31，继续完善推荐评分算法。
- 根据利润率、月销量、评分、竞争指数、物流成本和重量体积等因素优化推荐评分逻辑。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 30 记录

## Day 31 - 2026-06-02：推荐评分算法

### 今日完成内容
- 在 `server/utils/productMetrics.js` 中完善 `calculateRecommendationScore(product)`。
- 推荐评分现在综合利润率、月销量、评分、竞争指数、物流成本、重量和体积等级。
- 推荐评分范围控制在 `0 - 100`，分数越高代表越值得优先选品。
- `enrichProductMetrics(product)` 继续统一返回 `recommendationScore`，不影响原有 `profit`、`profitRate`、`profitRatePercent`、`riskLevel`、`competitionLevel` 等字段。
- `GET /api/products`、`GET /api/products/:id`、`GET /api/favorites` 会通过 `enrichProductMetrics` 返回推荐评分。
- `GET /api/dashboard` 的 `topProfitProducts` 也补充返回 `recommendationScore`。
- `AnalysisPage` 的高潜力商品继续优先按 `recommendationScore` 从高到低排序。
- 分析商品卡片展示整数推荐评分，商品详情页也补充展示推荐评分。

### 修改了哪些文件
- `server/utils/productMetrics.js`
- `server/routes/dashboard.js`
- `client/src/pages/AnalysisPage.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `docs/DAILY_LOG.md`

### 评分规则说明
- 利润率：最高 30 分，利润率越高分数越高，按最高 `250%` 做封顶。
- 月销量：最高 20 分，销量越高分数越高，按最高 `1000` 件/月做封顶。
- 评分：最高 20 分，评分越接近 `5.0` 分数越高。
- 低竞争：最高 15 分，`competitionScore` 越低分数越高。
- 低物流成本：最高 10 分，物流成本越低分数越高，按 `15` 元做封顶。
- 重量/体积：最高 5 分，其中重量最高 3 分，体积等级最高 2 分，小体积优于中体积和大体积。

### 测试方式
- 后端字段检查：
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/products/1`
  - `http://localhost:3000/api/favorites`
  - `http://localhost:3000/api/dashboard`
- 前端页面检查：
  - `http://localhost:5173/analysis`
  - 确认高潜力商品按推荐评分从高到低展示。
  - 确认分析卡片能看到“推荐评分”。
  - 确认推荐理由、高风险商品、低竞争高利润商品仍然正常展示。
- 静态检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：旧版推荐评分只考虑利润率、销量、评分和竞争指数，没有覆盖 Day 31 要求的物流成本和轻小件属性。
- 解决方式：在 `calculateRecommendationScore` 中补充 `shippingCost`、`weight`、`volumeLevel` 三类因素，并保持权重简单可解释。
- 问题 2：接口里的 Dashboard 摘要商品原来只返回利润相关字段。
- 解决方式：在 `topProfitProducts` 的映射结果中补充 `recommendationScore`，方便 Dashboard 相关商品数据也能拿到评分。
- 问题 3：缺失字段可能导致计算结果异常。
- 解决方式：继续使用 `getValidNumber` 和默认值处理缺失字段，并用 `clamp` 把各维度控制在合理范围内。

### 今日重点理解知识点
- 推荐评分不是机器学习算法，而是“业务权重 + 简单归一化”的综合排序规则。
- `calculateRecommendationScore` 只负责算分，`enrichProductMetrics` 负责把算好的字段统一加到商品对象上。
- 只要接口返回商品前调用了 `enrichProductMetrics`，前端就可以直接使用 `recommendationScore`。
- `AnalysisPage` 不重新计算评分，只消费后端返回的字段，并用 `sort()` 按分数排序展示。

### 明日计划
- 进入 Day 32，完善风险分析模块。
- 进一步整理 `riskFactors` 的生成逻辑，并在前端更清晰地展示风险原因。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 31 记录

## Day 32 - 2026-06-02：风险分析模块

### 今日完成内容
- 在 `server/utils/productMetrics.js` 中新增 `calculateRiskFactors(product)`。
- 风险原因现在按利润率、竞争指数、评分、评论数、物流成本、重量/体积生成数组。
- `riskLevel` 改为根据 `riskFactors` 数量判断：0 个为低风险，1-2 个为中风险，3 个及以上为高风险。
- `enrichProductMetrics(product)` 统一返回 `riskFactors` 和 `riskLevel`，不影响原有利润、利润率、竞争等级和推荐评分字段。
- `GET /api/dashboard` 的 `topProfitProducts` 摘要商品补充返回 `riskFactors`。
- 商品详情页在“市场与风险”模块中使用标签展示风险原因；没有风险原因时显示“暂无明显风险”。
- `AnalysisPage` 高风险商品模块继续按 `riskLevel` 和风险因素数量筛选，并优先展示风险原因标签。

### 修改了哪些文件
- `server/utils/productMetrics.js`
- `server/routes/dashboard.js`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/pages/AnalysisPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### 风险判断规则说明
- `profitRatePercent < 20`：利润率过低。
- `competitionScore >= 70`：竞争指数过高。
- `rating < 4.2`：评分过低。
- `reviewCount < 50`：评论数过少。
- `shippingCost > 10`：物流成本偏高。
- `weight >= 0.5` 或 `volumeLevel === 'large'`：重量/体积不适合轻小件。

### 风险等级规则
- `riskFactors.length === 0`：低风险。
- `riskFactors.length` 为 `1-2`：中风险。
- `riskFactors.length >= 3`：高风险。

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 检查接口：
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/products/1`
  - `http://localhost:3000/api/favorites`
  - `http://localhost:3000/api/dashboard`
- 启动前端：
  - `cd client`
  - `npm run dev`
- 检查页面：
  - `http://localhost:5173/products/1`
  - `http://localhost:5173/analysis`
- 静态检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：原始商品数据中已有 `riskFactors`，但内容更偏商品描述，不适合统一计算风险等级。
- 解决方式：在 `enrichProductMetrics` 中用后端统一计算后的 `riskFactors` 覆盖返回字段，让接口风险原因和 `riskLevel` 保持一致。
- 问题 2：如果只按 `riskLevel` 展示，高风险商品不容易解释为什么高风险。
- 解决方式：分析页高风险卡片优先展示风险标签，详情页也展示同一组风险原因。
- 问题 3：部分字段可能缺失或格式异常。
- 解决方式：继续使用 `getValidNumber` 做安全数字转换，缺失字段不会导致接口崩溃。

### 今日重点理解知识点
- `calculateRiskFactors` 负责把商品数据转换成“可解释的风险原因数组”。
- `getRiskLevel` 不再重复写一套风险条件，而是基于风险原因数量生成等级。
- `enrichProductMetrics` 是接口返回计算字段的统一入口，只要商品接口调用它，前端就能拿到 `riskFactors`。
- 前端详情页和分析页只负责展示后端返回的风险结果，不重新计算业务规则。

### 明日计划
- 进入 Day 33，部署前检查与最小上线验证。
- 检查前端构建、API 环境变量、React Router 刷新、后端端口、CORS 和 JSON 存储上线风险。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 32 记录

## Day 33 - 2026-06-03：部署前检查与最小上线验证

### 今日目标
- 检查项目是否具备前端 Vercel、后端 Render 的最小上线条件。
- 提前处理前端构建、API 地址、React Router 刷新、后端端口和 CORS 等部署前问题。
- 不做正式部署，不新增业务功能，不引入数据库，不接真实 API，不做大范围重构。

### 今日完成内容
- 已执行前端生产构建检查：`cd client` 后运行 `npm run build`，构建成功。
- 将前端 API 基地址从写死 `http://localhost:3000` 调整为支持 `VITE_API_BASE_URL`。
- 本地开发默认 API 地址仍然是 `http://localhost:3000`。
- 新增 `client/vercel.json`，让 Vercel 把 `/products`、`/products/1`、`/favorites`、`/analysis` 等前端路由 fallback 到 `index.html`。
- 将后端启动端口调整为 `process.env.PORT || 3000`，本地仍默认使用 `3000`，Render 可使用平台注入端口。
- 检查后端 CORS：当前使用 `app.use(cors())`，允许所有来源，适合当前演示阶段的 Vercel 前端请求 Render 后端。
- 复查当前 JSON 文件存储方案：`products.json` 和 `favorites.json` 适合本地 mock 和演示，但部署平台上的本地文件写入不适合作为长期稳定持久化方案。

### 修改了哪些文件
- `client/src/services/api.js`
- `client/vercel.json`
- `server/app.js`
- `docs/DAILY_LOG.md`

### 每个文件修改了什么
- `client/src/services/api.js`：新增 `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'`，让前端可在本地和线上后端之间切换。
- `client/vercel.json`：新增 Vercel rewrite 配置，解决 React Router 页面刷新后可能 404 的问题。
- `server/app.js`：将端口从固定 `3000` 改为 `process.env.PORT || 3000`。
- `docs/DAILY_LOG.md`：记录 Day 33 部署前检查结果、风险说明和后续部署方案。

### 前端 build 检查结果
- `npm run build` 成功。
- 构建输出中有 Vite chunk 体积提示，但不是构建失败；Day 33 不为该提示做拆包或大范围重构。

### API 地址环境变量适配
- 本地默认：
  - `http://localhost:3000`
- 线上部署时在 Vercel 配置：
  - `VITE_API_BASE_URL=Render 后端线上地址`
- 现有 `getProducts`、`getProductById`、`getDashboard`、`getFavorites`、`addFavorite`、`removeFavorite` 等接口函数保持不变。

### React Router / Vercel rewrite 检查
- 已添加 `client/vercel.json`。
- 作用是让 Vercel 在直接访问或刷新以下路径时返回 `index.html`：
  - `/products`
  - `/products/1`
  - `/favorites`
  - `/analysis`
- 该配置不影响本地 Vite 开发环境。

### 后端 process.env.PORT 检查
- 后端已支持：
  - `const PORT = process.env.PORT || 3000`
- 本地仍然可以通过 `npm start` 使用 `3000`。
- Render 部署时可以使用平台注入的 `PORT`。

### CORS 检查
- 当前后端使用：
  - `app.use(cors())`
- 含义是允许所有来源请求后端接口。
- 对当前作品演示阶段来说，Vercel 前端请求 Render 后端是可用的。
- 后续如果要更接近生产环境，可以再改成通过环境变量配置允许的前端域名，但今天不做复杂权限或鉴权系统。

### favorites.json 在线上持久化风险
- 当前 `server/data/favorites.json` 适合本地 mock、学习和演示。
- Render 等部署平台上的本地文件写入可能不是长期稳定持久化方案，服务重启、重新部署或实例变化后可能丢失写入数据。
- 今天不迁移数据库，不改变现有 favorites 功能。
- 后续如果需要长期保存收藏数据，应迁移到数据库，并尽量保持现有 API 行为不变。

### 部署方案
- 前端部署平台：Vercel。
- 后端部署平台：Render。
- 前端环境变量：
  - `VITE_API_BASE_URL=Render 后端线上地址`
- 后端需要支持：
  - `process.env.PORT`
- 前端需要支持：
  - React Router 刷新不 404。

### 测试方式
- 前端构建：
  - `cd client`
  - `npm run build`
- 后端本地运行：
  - `cd server`
  - `npm start`
- 后端接口检查：
  - `http://localhost:3000/api/health`
  - `http://localhost:3000/api/products`
  - `http://localhost:3000/api/dashboard`
  - `http://localhost:3000/api/favorites`
- 前端本地运行：
  - `cd client`
  - `npm run dev`
- 前端页面检查：
  - `http://localhost:5173/`
  - `http://localhost:5173/products`
  - `http://localhost:5173/products/1`
  - `http://localhost:5173/favorites`
  - `http://localhost:5173/analysis`

### 遇到的问题和解决方式
- 问题 1：前端 API 地址写死 `http://localhost:3000`，线上部署后会请求用户本机而不是 Render 后端。
- 解决方式：改为优先读取 `VITE_API_BASE_URL`，没有配置时再使用本地默认地址。
- 问题 2：后端端口写死 `3000`，Render 等平台部署时可能无法绑定平台分配端口。
- 解决方式：改为 `process.env.PORT || 3000`。
- 问题 3：React Router 的前端路由直接刷新时，Vercel 可能找不到对应静态文件。
- 解决方式：新增 `client/vercel.json`，统一 fallback 到 `index.html`。

### 今日重点理解知识点
- `VITE_API_BASE_URL` 是前端构建时注入的环境变量，用来区分本地后端和线上后端。
- `process.env.PORT` 是部署平台给 Node 服务注入的运行端口，后端不能只写死本地端口。
- `vercel.json` 的 rewrite 解决的是前端路由刷新问题，不是后端接口代理问题。
- JSON 文件存储适合 mock 阶段，但不是线上长期持久化方案。

### 明日计划
- 进入 Day 34，补齐商品图片与图片兜底。
- 优先保证商品列表、详情页、候选池页面的图片路径稳定，不依赖外部热链。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 33 记录

## Day 34 - 2026-06-03：商品图片补齐与图片兜底

### 今日目标
- 补齐 20 个手机支架商品的本地 mock 图片。
- 让商品列表、商品详情页和候选池页面都能展示商品图。
- 增加默认占位图，避免图片缺失或路径错误时出现破图。
- 不修改后端业务接口，不接真实 API，不引入数据库，不新增业务功能。

### 今日完成内容
- 已将用户提供的 20 张手机支架产品图整理到 `client/public/images/products/`。
- 新增默认占位图 `client/public/images/products/placeholder.png`。
- 根据商品名称和类目，为 `server/data/products.json` 中 20 个商品匹配本地图片。
- 为每个商品补充或规范 `image`、`imageSource`、`sourceImageUrl` 字段。
- `ProductCard` 现在直接展示商品图片，图片缺失或加载失败时切换默认占位图。
- `ProductDetailPage` 现在展示更大的商品图，图片缺失或加载失败时切换默认占位图。
- `FavoritesPage` 现在展示候选池商品图片，图片缺失或加载失败时切换默认占位图。
- 为商品列表、详情页和候选池图片补充基础尺寸、内边距和 `object-fit: contain` 样式，避免图片变形或被裁切。
- 为商品列表、商品详情和候选池图片增加悬浮层次感，鼠标停留时图片轻微放大并出现柔和渐变阴影。

### 修改了哪些文件
- `client/public/images/products/`
- `server/data/products.json`
- `client/src/components/ProductCard.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/pages/FavoritesPage.jsx`
- `client/src/App.css`
- `docs/DAILY_LOG.md`

### products.json 图片字段说明
- `image`：使用前端 public 目录下的本地静态资源路径，例如 `/images/products/car-suction-phone-stand-01.png`。
- `imageSource`：当前统一为 `local_mock`，表示图片来自本地 mock 资源。
- `sourceImageUrl`：当前统一为空字符串，为后续接入 1688 或其他真实图片源预留。

### 商品图片匹配结果
- `1 / 可折叠桌面手机支架 / /images/products/desktop-adjustable-stand-02.png`
- `2 / 真空吸盘车载手机支架 / /images/products/car-suction-phone-stand-01.png`
- `3 / 磁吸出风口车载手机支架 / /images/products/magnetic-air-vent-car-stand-01.png`
- `4 / 铝合金升降桌面手机支架 / /images/products/desktop-metal-stand-01.png`
- `5 / 直播补光三脚手机支架 / /images/products/live-fill-light-tripod-stand-01.png`
- `6 / 鹅颈懒人手机支架 / /images/products/lazy-gooseneck-phone-stand-01.png`
- `7 / 平板手机两用折叠支架 / /images/products/foldable-tablet-phone-stand-01.png`
- `8 / 迷你口袋折叠手机支架 / /images/products/foldable-pocket-phone-stand-02.png`
- `9 / 摩托车防震手机导航支架 / /images/products/car-motorcycle-anti-shock-stand-02.png`
- `10 / 床头夹式360旋转手机支架 / /images/products/lazy-bed-clip-360-stand-02.png`
- `11 / 磁吸无线充桌面手机支架 / /images/products/magnetic-wireless-charging-desktop-stand-02.png`
- `12 / 桌面直播俯拍手机支架 / /images/products/live-overhead-desktop-stand-02.png`
- `13 / 可拆卸磁吸折叠桌面手机支架 / /images/products/magnetic-detachable-foldable-desktop-stand-03.png`
- `14 / 双夹臂懒人床头手机支架 / /images/products/lazy-dual-arm-bed-stand-03.png`
- `15 / 便携旅行卡片式手机支架 / /images/products/foldable-travel-card-stand-03.png`
- `16 / 硅胶绑带自行车手机支架 / /images/products/car-bike-silicone-strap-stand-03.png`
- `17 / 平板手机两用升降直播支架 / /images/products/live-tablet-phone-lift-stand-03.png`
- `18 / 迷你折叠磁吸旅行手机支架 / /images/products/foldable-magnetic-travel-stand-04.png`
- `19 / 汽车后视镜夹式手机支架 / /images/products/car-rearview-mirror-clip-stand-04.png`
- `20 / 伸缩补光直播桌面手机支架 / /images/products/live-telescopic-fill-light-desktop-stand-04.png`

### 测试方式
- 启动后端：
  - `cd server`
  - `npm start`
- 启动前端：
  - `cd client`
  - `npm run dev`
- 页面检查：
  - `http://localhost:5173/products`
  - `http://localhost:5173/products/1`
  - `http://localhost:5173/favorites`
- 兜底测试：
  - 临时把某个商品的 `image` 改成错误路径，确认页面展示 `/images/products/placeholder.png`，而不是破图图标。
- 静态检查：
  - `cd client`
  - `npm run lint`
  - `npm run build`

### 遇到的问题和解决方式
- 问题 1：第一次复制图片时使用了 `Copy-Item -LiteralPath '...\*.png'`，通配符没有展开，只复制了占位图。
- 解决方式：改用 `Copy-Item -Path '...\*.png'` 批量复制 20 张图片。
- 问题 2：旧数据中的 `image` 指向 `/images/phone-holder-x.jpg`，但 public 目录下没有这些文件。
- 解决方式：统一改成 `/images/products/*.png` 本地路径。
- 问题 3：原页面在图片缺失时显示文字占位，不适合作品展示。
- 解决方式：三个页面统一使用 `/images/products/placeholder.png` 兜底。

### 今日重点理解知识点
- Vite 的 `public` 目录会作为静态资源根目录直接暴露，`client/public/images/products/a.png` 在页面中应写成 `/images/products/a.png`。
- `products.json` 中不能写 `client/public/...` 文件系统路径，也不需要写完整外部 URL。
- 图片加载失败时可以通过 `<img onError>` 修改状态，把 `src` 切换到默认占位图。
- 当前 `imageSource` 和 `sourceImageUrl` 是为未来真实图片源预留的字段，今天只使用本地 mock 图片。

### 明日计划
- 进入 Day 35，全局 UI 优化。
- 统一后台系统视觉风格、卡片间距、按钮和标签样式。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 34 记录

## Day 36 - 2026-06-04：正式部署上线

### 今日目标
- 完成前后端正式部署，让项目可以通过公网链接访问。
- 前端部署到 Vercel。
- 后端从原计划 Render 调整为 Vercel Serverless Express API。
- 保持最小改动，不新增业务功能，不改 UI，不接真实 Amazon / 1688 API，不重构页面。

### 今日完成内容
- 完成部署前最终检查：
  - 前端 `npm run build` 通过。
  - 后端 `npm start` 可启动。
  - 前端 API 基地址继续使用 `VITE_API_BASE_URL || http://localhost:3000`。
  - 后端 CORS 继续使用 `app.use(cors())`，支持前端跨域请求后端。
  - `client/vercel.json` 保留 React Router 页面刷新 fallback。
- 尝试使用 Render Free 部署后端，但当前 Render 账号创建服务时要求绑定银行卡。
- 决定改为 Vercel Serverless 后端部署方案，避免 Render 绑卡，并提升面试链接稳定性。
- 对 Express 后端做最小 Vercel Serverless 适配：
  - `server/app.js` 只负责创建 Express app、注册中间件和路由，并 `export default app`。
  - `server/index.js` 作为本地开发入口，负责 `app.listen(process.env.PORT || 3000)`。
  - `server/api/index.js` 作为 Vercel Serverless 入口，导入并导出同一个 Express app。
  - `server/vercel.json` 使用 rewrite，把请求交给 `/api` 入口处理。
- 检查并确认 Supabase 收藏功能仍然保留：
  - 候选池收藏数据使用 Supabase PostgreSQL `favorites` 表。
  - 前端继续通过 `x-client-id` 请求头传递匿名 `client_id`。
  - 后端继续从 `req.headers['x-client-id']` 读取 `client_id`。
  - `SUPABASE_SERVICE_ROLE_KEY` 只放后端环境变量，不写入前端。
- 后端 Vercel 项目部署成功。
- 前端 Vercel 项目部署成功。
- 用户确认前端公网链接可以正常发给别人打开。
- 了解并检查 Vercel Hobby Usage：
  - Usage 页面默认展示当前账号 / workspace 下所有项目最近 30 天用量。
  - 当前用量远低于 Hobby 限额，适合简历项目正常演示。

### 修改了哪些文件
- `server/app.js`
- `server/index.js`
- `server/api/index.js`
- `server/vercel.json`
- `server/package.json`
- `README.md`
- `docs/DAILY_LOG.md`

### 每个文件修改了什么
- `server/app.js`：
  - 去掉直接运行的 `app.listen(...)`。
  - 保留旧 `app.listen(...)` 代码为注释，方便学习对比。
  - 新增 `export default app`，让本地和 Vercel 共用同一个 Express app。
- `server/index.js`：
  - 新增本地开发启动入口。
  - 使用 `import 'dotenv/config'` 读取本地 `server/.env`。
  - 通过 `app.listen(process.env.PORT || 3000)` 启动本地后端。
- `server/api/index.js`：
  - 新增 Vercel Serverless 入口。
  - 导入 `../app.js` 并 `export default app`。
- `server/vercel.json`：
  - 新增 Vercel rewrite 配置：
    - `source: /(.*)`
    - `destination: /api`
  - 采用 Vercel Express 推荐写法，确保 `/api/health`、`/api/products`、`/api/dashboard`、`/api/favorites` 等请求进入 Express app。
- `server/package.json`：
  - 将 `main` 调整为 `index.js`。
  - 将 `start` 调整为 `node index.js`。
  - 确认运行时依赖包含 `express`、`cors`、`dotenv`、`@supabase/supabase-js`。
- `README.md`：
  - 同步当前部署架构：前端 Vercel，后端 Vercel Serverless。
  - 更新候选池数据说明：favorites 已迁移到 Supabase PostgreSQL。
  - 补充 Vercel 后端和前端部署配置。
  - 补充 Supabase 环境变量安全说明。
- `docs/DAILY_LOG.md`：
  - 记录 Day 36 正式部署过程、问题、解决方式和关键知识点。

### 后端 Vercel 部署配置
- Root Directory：`server`
- Framework Preset：`Other`
- Install Command：`npm install`
- Build Command：留空；如果 Vercel 要求填写，可填 `echo "no build step"`
- Output Directory：留空
- Environment Variables：
  - `SUPABASE_URL=https://xxxx.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx`

### 前端 Vercel 部署配置
- Root Directory：`client`
- Framework Preset：`Vite`
- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：`dist`
- Environment Variables：
  - `VITE_API_BASE_URL=https://后端项目名.vercel.app`

### 线上接口测试结果
- 后端 Vercel 项目已部署成功。
- 后端线上地址：
  - `https://cross-border-phone-holder-api.vercel.app/`
- 后端健康检查地址：
  - `https://cross-border-phone-holder-api.vercel.app/api/health`
- 需要重点检查以下接口：
  - `https://cross-border-phone-holder-api.vercel.app/api/health`
  - `https://cross-border-phone-holder-api.vercel.app/api/products`
  - `https://cross-border-phone-holder-api.vercel.app/api/products/1`
  - `https://cross-border-phone-holder-api.vercel.app/api/dashboard`
  - `https://cross-border-phone-holder-api.vercel.app/api/favorites`
- `/api/favorites` 需要 `x-client-id` 请求头，推荐通过前端页面收藏流程验证。

### 线上页面测试结果
- 前端 Vercel 项目已部署成功。
- 用户确认前端公网地址可以正常发给别人打开。
- 前端线上地址：
  - `https://cross-border-phone-holder-analyzer.vercel.app/`
- 需要继续回归测试：
  - `/`
  - `/products`
  - `/products/1`
  - `/favorites`
  - `/analysis`
- 核心功能检查：
  - Dashboard 数据加载。
  - 商品列表加载。
  - 商品详情打开。
  - 搜索、类目筛选、利润率筛选、排序。
  - 加入候选池。
  - 候选池显示收藏商品。
  - 取消收藏。
  - React Router 页面刷新不 404。

### Supabase 验证方式
- 打开线上前端页面。
- 点击某个商品的“加入候选池”。
- 打开 Supabase Table Editor。
- 检查 `favorites` 表是否新增：
  - `client_id`
  - `product_id`
- 在线上前端取消收藏。
- 回到 Supabase 确认对应记录被删除。

### 遇到的问题和解决方式
- 问题 1：Render Free 创建服务时要求 Add Card。
- 解决方式：不绑定银行卡，放弃 Render 路线，改为 Vercel Serverless 部署 Express 后端。
- 问题 2：Express 原本在 `app.js` 中直接 `app.listen(...)`，不适合 Vercel Serverless。
- 解决方式：拆分为 `app.js`、`index.js`、`api/index.js` 三层入口，接口逻辑仍然只保留一份。
- 问题 3：`server/vercel.json` 中 rewrite destination 写 `/api/index` 存在命中风险。
- 解决方式：改为 Vercel Express 推荐写法 `destination: /api`。
- 问题 4：Supabase service role key 不能暴露给前端。
- 解决方式：只在后端 Vercel 项目配置 `SUPABASE_SERVICE_ROLE_KEY`，前端只配置 `VITE_API_BASE_URL`。
- 问题 5：担心 Vercel Hobby 额度被耗尽。
- 解决方式：查看 Usage 页面，理解当前展示的是账号 / workspace 最近 30 天用量；正常简历演示访问量远低于限额，不建议公开到大流量渠道或做压力测试。

### 当前线上数据存储说明
- 商品数据：
  - 仍然来自 `server/data/products.json`。
  - 适合当前 mock 数据展示阶段。
- 候选池数据：
  - 已迁移到 Supabase PostgreSQL `favorites` 表。
  - 通过匿名 `client_id` 区分不同浏览器访问者。
- 后续如果要更完整生产化，可以继续将 `products.json` 迁移到数据库。

### 今日重点理解知识点
- Vercel 可以同时部署静态前端和 Serverless 后端，但本项目为了清晰，前端和后端拆成两个 Vercel 项目。
- `server/app.js` 是 Express 应用主体，`server/index.js` 是本地启动器，`server/api/index.js` 是 Vercel Serverless 启动器。
- `VITE_API_BASE_URL` 是前端连接线上后端的关键环境变量。
- `SUPABASE_SERVICE_ROLE_KEY` 是后端密钥，不能加 `VITE_` 前缀，不能放进前端项目。
- Vercel Hobby Usage 默认可以查看所有项目最近 30 天用量，也可以切换单项目查看。

### 明日计划
- 进入 Day 37，整理代码结构与 API 封装。
- 回归检查线上核心页面和收藏流程。
- 将实际前端地址、后端地址和健康检查地址补充到 README。
- 准备项目截图和 README 展示材料。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 36 记录。

## Day 37 - 2026-06-05：代码结构整理与 API 封装

### 今日目标
- 做工程化整理，让前后端代码结构更清晰。
- 减少重复格式化、数字判断、商品字段兜底、筛选排序和错误响应逻辑。
- 保持现有页面主功能、接口路径、部署方式和 Supabase 收藏池稳定。
- 为后续 products 迁移 Supabase、智谱 AI、AI 选品助手和轻量级 RAG 打基础。

### 今日完成内容
- 新增前端 `utils` 工具目录，统一处理数字、格式化和商品字段兜底。
- 新增前端 common 状态组件，统一 loading、error、empty 展示。
- 替换商品卡片、商品详情、候选池、Dashboard、Analysis、图表组件中的重复格式化逻辑。
- 整理 `client/src/services/api.js`，统一 base URL 拼接、headers 构造、JSON/text 解析和错误处理。
- 后端新增数字、响应、商品筛选、商品排序、商品读取工具。
- 后端 `productMetrics.js` 改为复用统一数字工具，但利润率、推荐评分和风险指标计算逻辑保持不变。
- 后端 `products`、`dashboard`、`favorites` 路由改为复用 utils，减少 route 文件里的重复逻辑。
- 收藏池继续使用 Supabase `favorites` 表，没有改回 `favorites.json`。
- 商品数据继续来自 `server/data/products.json`，没有提前迁移 products 到 Supabase。

### 修改了哪些文件
- `client/src/utils/number.js`
- `client/src/utils/format.js`
- `client/src/utils/product.js`
- `client/src/components/common/LoadingState.jsx`
- `client/src/components/common/ErrorState.jsx`
- `client/src/components/common/EmptyState.jsx`
- `client/src/services/api.js`
- `client/src/components/ProductCard.jsx`
- `client/src/components/ProfitRankingChart.jsx`
- `client/src/components/CategoryPieChart.jsx`
- `client/src/pages/ProductsPage.jsx`
- `client/src/pages/DashboardPage.jsx`
- `client/src/pages/AnalysisPage.jsx`
- `client/src/pages/FavoritesPage.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `server/utils/number.js`
- `server/utils/response.js`
- `server/utils/productFilters.js`
- `server/utils/productSort.js`
- `server/utils/productStore.js`
- `server/utils/productMetrics.js`
- `server/routes/products.js`
- `server/routes/dashboard.js`
- `server/routes/favorites.js`
- `docs/DAILY_LOG.md`

### 前端整理结果
- `number.js` 统一提供：
  - `toNumberOrNull`
  - `safeNumber`
  - `clamp`
  - `roundTo`
- `format.js` 统一提供：
  - `formatMoney`
  - `formatPercent`
  - `formatNumber`
  - `formatRating`
  - `formatScore`
  - `formatText`
- `product.js` 统一提供：
  - 默认商品图片
  - 商品名称兜底
  - 商品类目兜底
  - risk level 文案
  - tags / riskFactors 数组兜底
  - `getProfitRatePercent`，兼容 `profitRatePercent` 和 `profitRate`
- common 状态组件复用原来的 `page-note` 样式，没有改变 UI 风格。
- 页面里的 `0`、`0%`、`0.0`、物流成本 0、评分 0 等有效值不会被误判为“暂无”。

### API 封装整理结果
- 前端接口函数名保持不变：
  - `getProducts`
  - `getProductById`
  - `getDashboard`
  - `getFavorites`
  - `addFavorite`
  - `removeFavorite`
- 接口路径保持不变：
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/dashboard`
  - `GET /api/favorites`
  - `POST /api/favorites`
  - `DELETE /api/favorites/:id`
- 前端仍然通过 `VITE_API_BASE_URL` 配置线上后端地址。
- `api.js` 现在统一处理：
  - base URL 尾部斜杠
  - 请求路径拼接
  - `x-client-id`
  - `Content-Type`
  - JSON 解析错误
  - HTTP 非 2xx 错误
  - `success: false`
  - `status: "error"`
- `POST /api/favorites` 当前成功返回 `status: "success"`，不会被误判为失败。

### 后端整理结果
- `server/utils/number.js` 统一处理：
  - `getValidNumber`
  - `roundTo`
  - `clamp`
  - `parsePositiveInteger`
- `server/utils/response.js` 统一处理：
  - `sendSuccess`
  - `sendError`
- `server/utils/productFilters.js` 统一处理：
  - 关键词搜索
  - 类目筛选
  - 最低利润率筛选
- `server/utils/productSort.js` 统一处理商品排序。
- `server/utils/productStore.js` 统一读取 `server/data/products.json`。
- `products.js` 不再堆筛选和排序细节。
- `dashboard.js` 不再重复读取 products 和重复 round 逻辑。
- `favorites.js` 保留 Supabase 收藏池逻辑，只整理 id 解析、商品读取和响应返回。

### 保持不变的内容
- 没有新增 UI 组件库。
- 没有引入 TypeScript。
- 没有接入 AI。
- 没有迁移 products 到 Supabase。
- 没有删除 `products.json`。
- 没有改变页面主功能。
- 没有改变线上部署方式。
- 没有改变 Supabase 表名、字段名、`x-client-id` 请求头或查询条件。

### 本地验证结果
- 前端构建：
  - `cd client`
  - `npm run build`
  - 结果：通过
- 前端 lint：
  - `cd client`
  - `npm run lint`
  - 结果：通过
- 后端语法检查：
  - 对 `server` 下所有 `.js` 文件执行 `node --check`
  - 结果：通过
- 构建时仍有 Vite chunk 体积提示，主要来自现有依赖体积，不影响本次构建成功。

### 发现但暂未处理的无用文件
- `client/src/components/BasicChart.jsx` 当前未被引用，暂未删除。
- `client/src/assets/react.svg`、`vite.svg`、`hero.png` 当前未发现引用，暂未删除。
- `server/config/env.js` 当前未发现引用，暂未删除。
- `server/app.js` health 文案里的 `gogogo!` 像临时文案，暂未修改。

### 今日重点理解知识点
- `children` 是 React 组件标签中间传入的内容，例如 `<ErrorState>错误信息</ErrorState>` 中的“错误信息”。
- 公共格式化函数可以减少页面重复代码，也能统一处理 `0` 值、空值和异常值。
- API 封装层应该负责请求地址、headers、解析和错误处理，页面只关心业务数据。
- 后端 routes 应尽量负责“接请求、调工具、返回结果”，筛选、排序、计算和响应格式可以抽到 utils。
- 做结构整理时，最重要的是保持行为稳定，而不是为了重构而重写功能。

### 明日计划
- 进入 Day 38，准备 products 从 JSON 迁移到 Supabase 的方案或实现。
- 优先保持现有前端 API 调用方式不变。
- 重点考虑 products 表字段映射、数据导入、读取层替换和线上环境变量安全。

### 是否更新 DAILY_LOG.md
- 是，已更新 Day 37 记录。
