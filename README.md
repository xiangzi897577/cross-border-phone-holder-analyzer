# 跨境电商手机支架选品分析平台

`cross-border-phone-holder-analyzer` 是一个面向前端暑期实习投递的前后端分离项目。项目聚焦手机支架这个跨境电商轻小件品类，后续会通过 Amazon 候选商品与 1688 货源数据对比，分析利润率、物流成本、竞争强度、评分风险和推荐指数。

当前仍处于 Day 1 完成状态：项目脚手架、基础页面、后端最小接口和文档体系已经建立，但还没有进入真实商品分析功能开发。

## 当前技术栈
- 前端：`Vite + React + JavaScript`
- 后端：`Node.js + Express`
- 后端模块规范：`ES Module`
- 数据存储：后续使用本地 `JSON` 文件

## 当前目录结构
```text
cross-border-phone-holder-analyzer/
├─ AGENTS.md
├─ README.md
├─ docs/
│  ├─ DAILY_LOG.md
│  └─ PROJECT_PLAN.md
├─ client/
└─ server/
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

## 当前未完成内容
- 商品数据结构
- 商品列表接口
- 商品详情接口
- Dashboard 数据接口
- 前后端联调
- 商品分析公式

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
- `client/package.json`
  - 前端依赖和启动脚本。
- `server/package.json`
  - 后端依赖、启动脚本和模块类型配置。

## 当前状态说明
- 前端不是数据平台成品，而是 Day 1 的项目介绍页。
- 后端不是完整业务 API，而是 Day 1 的最小可运行服务。
- 根目录文档已按当前真实状态同步。
