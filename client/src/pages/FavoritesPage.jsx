import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CandidateCompareTable from '../components/CandidateCompareTable.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import { getFavorites, removeFavorite } from '../services/api'
import { formatMoney, formatPercent, formatRating, formatScore } from '../utils/format'
import {
  getProductCategory,
  getProductImage,
  getProductName,
  getRiskLevelText,
} from '../utils/product'

const MAX_COMPARE_PRODUCTS = 4

function FavoriteProductItem({
  product,
  removingProductId,
  selectedForCompare,
  onCompareToggle,
  onRemove,
}) {
  const [imageLoadError, setImageLoadError] = useState(false)
  const hasProductId = product?.id !== undefined && product?.id !== null && product?.id !== ''
  const isRemoving = hasProductId && removingProductId === product.id
  const productName = getProductName(product)
  const productImage = getProductImage(product, imageLoadError)
  const riskLevel = product?.riskLevel || 'unknown'
  const riskBadgeClassName = `favorite-card__risk-badge favorite-card__risk-badge--${riskLevel}`

  return (
    <article className="favorite-card">
      <Link
        to={hasProductId ? `/products/${product.id}` : '/products'}
        className="favorite-card__link"
      >
        <div className="favorite-card__image-wrapper">
          <img
            className="favorite-card__image"
            src={productImage}
            alt={productName}
            onError={() => setImageLoadError(true)}
          />
        </div>

        <div className="favorite-card__content">
          <div className="favorite-card__header">
            <div className="favorite-card__tag-row">
              <p className="favorite-card__category">{getProductCategory(product)}</p>
              <span className={riskBadgeClassName}>{getRiskLevelText(riskLevel)}</span>
            </div>
            <h3 className="favorite-card__title">{productName}</h3>
          </div>

          <div className="favorite-card__metrics">
            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">Amazon 售价</span>
              <strong className="favorite-card__metric-value">
                {formatMoney(product?.amazonPrice, '$')}
              </strong>
            </div>

            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">1688 成本</span>
              <strong className="favorite-card__metric-value">
                {formatMoney(product?.cost1688, '¥')}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--profit">
              <span className="favorite-card__metric-label">利润率</span>
              <strong className="favorite-card__metric-value">
                {formatPercent(product?.profitRatePercent)}
              </strong>
            </div>

            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">评分</span>
              <strong className="favorite-card__metric-value">
                {formatRating(product?.rating)}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--competition">
              <span className="favorite-card__metric-label">竞争指数</span>
              <strong className="favorite-card__metric-value">
                {formatScore(product?.competitionScore)}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--score">
              <span className="favorite-card__metric-label">推荐评分</span>
              <strong className="favorite-card__metric-value">
                {formatScore(product?.recommendationScore)}
              </strong>
            </div>
          </div>

          <span className="favorite-card__detail-hint">
            {hasProductId ? '查看商品详情' : '缺少商品 id'}
          </span>
        </div>
      </Link>

      <div className="favorite-card__actions">
        <label className="favorite-card__compare-control">
          <input
            type="checkbox"
            checked={selectedForCompare}
            disabled={!hasProductId || isRemoving}
            onChange={() => onCompareToggle(product)}
          />
          <span>{selectedForCompare ? '已加入对比' : '加入对比'}</span>
        </label>

        <button
          className="favorite-card__remove-button"
          type="button"
          disabled={!hasProductId || isRemoving}
          onClick={() => onRemove(product)}
        >
          {isRemoving ? '取消中...' : '取消收藏'}
        </button>
      </div>
    </article>
  )
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [removingProductId, setRemovingProductId] = useState(null)
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [compareMessage, setCompareMessage] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchFavorites() {
      setLoading(true)
      setError('')
      setRemoveError('')
      setFavorites([])
      setSelectedProductIds([])
      setCompareMessage('')

      try {
        const favoritesData = await getFavorites({ signal: abortController.signal })
        setFavorites(favoritesData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取候选池商品失败')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()

    return () => {
      abortController.abort()
    }
  }, [])

  async function handleRemoveFavorite(product) {
    if (!product?.id || removingProductId !== null) {
      return
    }

    setRemovingProductId(product.id)
    setRemoveError('')

    try {
      await removeFavorite(product.id)
      setFavorites((currentFavorites) =>
        currentFavorites.filter((favoriteProduct) => favoriteProduct.id !== product.id),
      )
      setSelectedProductIds((currentIds) =>
        currentIds.filter((selectedProductId) => selectedProductId !== product.id),
      )
    } catch (requestError) {
      setRemoveError(requestError.message || '取消收藏失败')
    } finally {
      setRemovingProductId(null)
    }
  }

  function handleCompareToggle(product) {
    if (!product?.id) {
      return
    }

    setSelectedProductIds((currentIds) => {
      if (currentIds.includes(product.id)) {
        setCompareMessage('')
        return currentIds.filter((selectedProductId) => selectedProductId !== product.id)
      }

      if (currentIds.length >= MAX_COMPARE_PRODUCTS) {
        setCompareMessage('最多只能选择 4 个候选商品进行对比。')
        return currentIds
      }

      setCompareMessage('')
      return [...currentIds, product.id]
    })
  }

  const hasFavorites = favorites.length > 0
  const selectedProducts = favorites.filter((product) => selectedProductIds.includes(product.id))

  return (
    <section className="page favorites-page">
      {loading ? <LoadingState>候选池加载中...</LoadingState> : null}

      {!loading && error ? <ErrorState>{error}</ErrorState> : null}

      {!loading && !error && removeError ? (
        <ErrorState prefix="取消收藏失败：">{removeError}</ErrorState>
      ) : null}

      {!loading && !error && !hasFavorites ? (
        <EmptyState>候选池暂无商品，可先从商品列表选择高潜力款加入跟进。</EmptyState>
      ) : null}

      {!loading && !error && hasFavorites ? (
        <>
          <p className="page-note page-note--info">
            当前候选池共有 <strong>{favorites.length}</strong> 件商品，点击商品内容可进入详情页，可选择 2-4 件进行横向对比。
          </p>

          <div className="favorites-page__list">
            {favorites.map((product) => (
              <FavoriteProductItem
                key={product.id ?? product.productName}
                product={product}
                removingProductId={removingProductId}
                selectedForCompare={selectedProductIds.includes(product.id)}
                onCompareToggle={handleCompareToggle}
                onRemove={handleRemoveFavorite}
              />
            ))}
          </div>

          <section className="candidate-compare">
            <div className="candidate-compare__header">
              <div>
                <p className="candidate-compare__eyebrow">Candidate Comparison</p>
                <h3 className="candidate-compare__title">候选商品横向对比</h3>
              </div>
              <span className="candidate-compare__count">
                已选择 {selectedProducts.length}/{MAX_COMPARE_PRODUCTS}
              </span>
            </div>

            {compareMessage ? (
              <p className="candidate-compare__message">{compareMessage}</p>
            ) : null}

            <CandidateCompareTable products={selectedProducts} />
          </section>
        </>
      ) : null}
    </section>
  )
}

export default FavoritesPage
