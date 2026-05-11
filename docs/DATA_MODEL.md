# DATA_MODEL

## 商品数据字段说明

当前阶段只做商品数据建模，不实现接口和利润计算函数。`products.json` 中的每一条记录都表示一个手机支架商品，字段保持统一，方便后续列表、详情、筛选、排序和图表统计直接复用。

> 说明：`amazonPrice` 使用美元，`cost1688` 和 `shippingCost` 使用人民币。后续做利润测算时，需要先统一币种再计算。

| 字段名 | 类型 | 含义 | 示例 | 后续用途 |
| --- | --- | --- | --- | --- |
| `id` | number | 商品唯一标识 | `1` | 用于商品详情查询、收藏关联、列表渲染 key |
| `productName` | string | 商品名称 | `可折叠桌面手机支架` | 用于列表展示、搜索、详情页标题 |
| `category` | string | 商品类型 | `车载手机支架` | 用于类目筛选、Dashboard 类目统计 |
| `amazonPrice` | number | Amazon 预估售价，单位美元 | `19.99` | 用于后续销售额、平台手续费、利润率计算 |
| `cost1688` | number | 1688 采购成本，单位人民币 | `14.2` | 用于后续单件成本和利润计算 |
| `shippingCost` | number | 单件预估物流成本，单位人民币 | `6.8` | 用于利润测算、物流成本分析、风险判断 |
| `platformFeeRate` | number | 平台手续费比例 | `0.15` | 用于后续平台手续费计算 |
| `estimatedMonthlySales` | number | 预估月销量 | `920` | 用于销量分析、推荐评分、Dashboard 统计 |
| `rating` | number | 商品评分 | `4.3` | 用于口碑评估、风险判断、排序 |
| `reviewCount` | number | 评论数 | `2480` | 用于判断市场成熟度、竞争强度和可信度 |
| `competitionScore` | number | 竞争指数，范围 0-100 | `82` | 用于竞争等级判断、排序、风险分析 |
| `weight` | number | 商品重量，单位 kg | `0.31` | 用于物流成本分析、轻小件判断 |
| `volumeLevel` | string | 体积等级，只用 `small`、`medium`、`large` | `small` | 用于物流难度分析、风险等级判断 |
| `material` | string | 主材质 | `ABS+TPU` | 用于详情展示、风险说明、卖点分析 |
| `supplier` | string | 模拟 1688 供应商名称 | `深圳市驰稳车品厂` | 用于货源展示，后续也可扩展供应商筛选 |
| `image` | string | 商品图片路径 | `/images/phone-holder-2.jpg` | 用于列表卡片和详情页图片展示 |
| `tags` | string[] | 商品标签数组 | `["车载", "热销", "轻小件"]` | 用于搜索、筛选、标签展示 |
| `riskFactors` | string[] | 初始风险因素数组 | `["车载品类竞争强"]` | 用于后续风险等级展示和分析页说明 |
| `recommendationReason` | string | 推荐理由 | `车载需求稳定，月销潜力高` | 用于详情页和分析页解释为什么推荐 |

## 当前建模思路

1. 一条商品数据同时覆盖基础展示字段、成本字段、市场字段和风险字段，避免后续页面或接口还要补结构。
2. `category`、`volumeLevel`、`tags` 都尽量保持语义稳定，方便后续做筛选条件和图表分组。
3. `riskFactors` 和 `recommendationReason` 先作为静态业务描述，后续再逐步过渡到由计算逻辑辅助生成。
4. `amazonPrice`、`cost1688`、`shippingCost` 分开存储，方便后续拆解利润来源，而不是只保留一个最终利润值。
