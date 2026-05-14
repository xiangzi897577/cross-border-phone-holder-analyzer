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
