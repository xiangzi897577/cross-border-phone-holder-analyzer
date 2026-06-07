# 性能优化说明

## 优化目标

商品列表、Dashboard、选品分析、商品详情和候选池页面在接口较慢时不再长时间空白等待，而是优先展示本地缓存数据，再后台同步最新接口结果。

## 优化方案

* 前端对完整商品池、Dashboard、商品详情和候选池数据做 `localStorage` 缓存，缓存有效期为 6 小时。
* 页面采用 stale-while-revalidate 体验：先展示缓存数据，同时后台请求最新数据。
* 商品列表的关键词、类目、利润率、排序和策略筛选改为基于完整商品池的前端二次筛选，减少重复接口请求。
* 后端对 Supabase 商品池读取增加 5 分钟内存缓存，减少 Dashboard、商品列表、详情页等重复读取 Supabase 的开销。

## 测量方法

测量工具：Playwright + Microsoft Edge Headless。

测量口径：

* 从 `page.goto()` 开始计时。
* 到页面首个有意义内容可见结束计时。
* Products 以 `.product-card` 可见为结束点。
* Dashboard 以 `.dashboard-page__hero` 可见为结束点。
* Analysis 以 `.analysis-card` 可见为结束点。
* ProductDetail 以 `.detail-page__hero` 可见为结束点。
* Favorites 以 `.favorite-card` 可见为结束点。

## 本地 warm API 测量结果

测试环境：`http://127.0.0.1:5176` + `http://localhost:3002`，同一 BrowserContext。

| 页面 | 无前端缓存 | 缓存命中 | 节省时间 | 提升比例 |
| --- | ---: | ---: | ---: | ---: |
| Dashboard | 1609ms | 353ms | 1256ms | 78% |
| Products | 443ms | 380ms | 63ms | 14% |
| Analysis | 439ms | 278ms | 161ms | 37% |
| ProductDetail | 490ms | 266ms | 224ms | 46% |
| Favorites | 1052ms | 271ms | 781ms | 74% |

## 模拟慢接口测量结果

测试方式：使用 Playwright route 将 `/api/**` 请求人为延迟 4000ms，模拟线上 Serverless 冷启动或远程数据库请求较慢的场景。

| 页面 | 无前端缓存 | 缓存命中 | 节省时间 | 提升比例 |
| --- | ---: | ---: | ---: | ---: |
| Dashboard | 4697ms | 350ms | 4347ms | 93% |
| Products | 4621ms | 379ms | 4242ms | 92% |
| Analysis | 4648ms | 278ms | 4370ms | 94% |
| ProductDetail | 4643ms | 293ms | 4350ms | 94% |
| Favorites | 4614ms | 274ms | 4340ms | 94% |

## 面试讲解口径

可以这样描述：

> 我发现接口较慢时页面会长时间停留在 Loading，尤其线上 Serverless 冷启动或远程 Supabase 查询时体感明显。为此我实现了前端数据缓存和 stale-while-revalidate：页面先展示缓存数据，再后台刷新最新数据；商品列表筛选也改为基于完整商品池的前端二次筛选。使用 Playwright 在同一浏览器会话下测量，模拟 4 秒接口延迟时，主要页面首个有意义内容可见时间从约 4.6 秒降到 0.27-0.38 秒，提升约 92%-94%。

注意：这个优化提升的是“二次访问 / 缓存命中 / 接口慢时”的体感速度。首次访问仍然取决于后端接口、网络和部署平台冷启动。
