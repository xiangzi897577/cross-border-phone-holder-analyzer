# 跨境电商手机支架选品分析平台

## 项目背景

这是一个面向跨境电商卖家的选品分析练习项目，聚焦“手机支架”这一轻小件品类。项目使用本地 JSON 数据模拟 Amazon 候选商品与 1688 货源信息，帮助卖家从利润、竞争和风险几个角度快速判断商品潜力。

## 项目目标

项目希望通过利润测算、竞争强度评估、风险等级判断和 Dashboard 统计分析，输出更适合做跨境选品参考的商品数据，为后续前端页面展示和面试讲解打下基础。

## 当前技术栈

- Node.js
- Express
- JSON 文件存储
- 后续前端计划使用 React + Vite + JavaScript

## 当前已完成接口

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/dashboard`

## 接口说明

### `GET /api/health`

用于检查后端服务是否正常运行。

### `GET /api/products`

返回商品列表数据，并附带利润、利润率、平台手续费、竞争等级、风险等级等计算字段。

### `GET /api/products/:id`

根据商品 `id` 返回单个商品详情。

### `GET /api/dashboard`

返回 Dashboard 首页所需的统计数据，包括商品总数、平均利润率、高潜力商品数、风险商品数、分类分布等指标。

## 本地运行方式

1. 进入 `server` 目录
2. 安装依赖
3. 启动服务
4. 访问接口进行测试

```bash
cd server
npm install
npm start
```

启动后可访问：

- [http://localhost:3000/api/health](http://localhost:3000/api/health)
- [http://localhost:3000/api/products](http://localhost:3000/api/products)
- [http://localhost:3000/api/products/1](http://localhost:3000/api/products/1)
- [http://localhost:3000/api/dashboard](http://localhost:3000/api/dashboard)

## 第一阶段完成情况

- 后端服务入口已完成，`cors` 和 `express.json()` 已配置
- 商品数据文件 `server/data/products.json` 已整理并补充到 20 条
- 商品列表接口、商品详情接口、Dashboard 统计接口均已可用
- 商品接口已集成利润、利润率、竞争等级、风险等级等计算字段
- 第一阶段后端基础接口和数据准备工作已经完成

## 后续计划

下一阶段进入 React 前端页面开发，优先完成基础路由、页面结构和接口联调，再逐步补充展示组件与 Dashboard 页面内容。
