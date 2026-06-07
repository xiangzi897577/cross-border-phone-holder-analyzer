import { getValidNumber } from '../utils/number.js'

function formatPercent(value) {
  const numberValue = getValidNumber(value)

  if (numberValue === null) {
    return '暂无'
  }

  return `${numberValue.toFixed(1)}%`
}

function formatNumber(value, digits = 0) {
  const numberValue = getValidNumber(value)

  if (numberValue === null) {
    return '暂无'
  }

  return numberValue.toFixed(digits)
}

function formatText(value, emptyText = '暂无') {
  if (value === null || value === undefined) {
    return emptyText
  }

  if (typeof value === 'string') {
    return value.trim() || emptyText
  }

  return String(value)
}

function formatRiskFactors(product) {
  return Array.isArray(product?.riskFactors) && product.riskFactors.length > 0
    ? product.riskFactors.filter(Boolean).join('、')
    : '暂无明显风险因素'
}

function buildProductDataText(product) {
  return `
- 商品名称：${formatText(product?.productName)}
- 类目：${formatText(product?.category)}
- Amazon 售价：$${formatNumber(product?.amazonPrice, 2)}
- 1688 成本：¥${formatNumber(product?.cost1688, 2)}
- 物流成本：¥${formatNumber(product?.shippingCost, 2)}
- 利润率：${formatPercent(product?.profitRatePercent)}
- 预估月销量：${formatNumber(product?.estimatedMonthlySales)}
- 评分：${formatNumber(product?.rating, 1)}
- 评论数：${formatNumber(product?.reviewCount)}
- 竞争度：${formatNumber(product?.competitionScore)}
- 推荐分：${formatNumber(product?.recommendationScore)}
- 风险因素：${formatRiskFactors(product)}
- 当前推荐说明：${formatText(product?.recommendationReason)}
`.trim()
}

export function buildProductReportMessages(product) {
  const productDataText = buildProductDataText(product)
  const systemPrompt = `
你是一位有经验的跨境电商手机支架选品分析师。请只基于后端提供的商品数据生成报告，不要编造不存在的数据。
报告必须使用 Markdown 格式，语气清晰、具体、可执行，适合前端暑期实习项目展示。

商品数据如下：
${productDataText}

报告必须包含以下小节：
1. 综合结论
2. 利润表现分析
3. 市场需求分析
4. 竞争风险分析
5. 风险因素总结
6. 适合卖家类型
7. 是否建议上架
8. 下一步操作建议

请避免空泛表述，尽量引用利润率、销量、评分、竞争度、推荐分和风险因素进行判断。
`.trim()

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: '请基于这一个商品生成 AI 深度选品分析报告。',
    },
  ]
}
