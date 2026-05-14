import { useState } from 'react'
import { Link } from 'react-router-dom'

function formatMoney(value, symbol) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${symbol}${value.toFixed(2)}`
}

function formatPercent(value) {
  if (typeof value !== 'number') {
    return '0.0%'
  }

  return `${value.toFixed(1)}%`
}

function formatNumber(value, digits = 0) {
  if (typeof value !== 'number') {
    return digits === 0 ? '0' : (0).toFixed(digits)
  }

  return value.toFixed(digits)
}

function ProductCard({ product }) {
  const [imageLoadError, setImageLoadError] = useState(false)
  const hasProductId = product?.id !== undefined && product?.id !== null && product?.id !== ''
  const hasImage = typeof product?.image === 'string' && product.image.trim() !== '' && !imageLoadError
  const productName = product?.productName || '暂无'

  const cardContent = (
    <>
      <div className="product-card__image-wrapper">
        {hasImage ? (
          <img
            className="product-card__image"
            src={product.image}
            alt={productName}
            onError={() => setImageLoadError(true)}
          />
        ) : (
          <div className="product-card__image-placeholder">暂无图片</div>
        )}
      </div>

      <div className="product-card__body">
        <div>
          <p className="product-card__category">{product?.category || '暂无'}</p>
          <h3 className="product-card__title">{productName}</h3>
        </div>

        <div className="product-card__metrics">
          <div className="product-card__metric">
            <span className="product-card__metric-label">Amazon 售价</span>
            <strong className="product-card__metric-value">
              {formatMoney(product?.amazonPrice, '$')}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">1688 成本</span>
            <strong className="product-card__metric-value">
              {formatMoney(product?.cost1688, '¥')}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">利润率</span>
            <strong className="product-card__metric-value">
              {formatPercent(product?.profitRatePercent)}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">竞争指数</span>
            <strong className="product-card__metric-value">
              {formatNumber(product?.competitionScore)}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">评分</span>
            <strong className="product-card__metric-value">
              {formatNumber(product?.rating, 1)}
            </strong>
          </div>
        </div>

        <div className="product-card__footer">
          <span className="product-card__detail-hint">
            {hasProductId ? `点击查看商品 #${product.id}` : '缺少商品 id，暂时无法跳转'}
          </span>
        </div>
      </div>
    </>
  )

  if (!hasProductId) {
    return (
      <article className="product-card product-card--disabled" aria-disabled="true">
        {cardContent}
      </article>
    )
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {cardContent}
    </Link>
  )
}

export default ProductCard
