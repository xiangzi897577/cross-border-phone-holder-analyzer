import { PRODUCT_STRATEGIES } from '../utils/productStrategies'

function ProductStrategyFilter({ activeStrategyId, onStrategyChange, onClear }) {
  const activeStrategy = PRODUCT_STRATEGIES.find((strategy) => strategy.id === activeStrategyId)

  return (
    <section className="strategy-filter" aria-label="预设选品策略">
      <div className="strategy-filter__header">
        <div>
          <p className="strategy-filter__eyebrow">Selection Strategy</p>
          <h3 className="strategy-filter__title">预设选品策略</h3>
        </div>
        {activeStrategy ? (
          <button className="strategy-filter__clear-button" type="button" onClick={onClear}>
            清除策略
          </button>
        ) : null}
      </div>

      <div className="strategy-filter__list">
        {PRODUCT_STRATEGIES.map((strategy) => {
          const isActive = strategy.id === activeStrategyId

          return (
            <button
              className={
                isActive
                  ? 'strategy-filter__button strategy-filter__button--active'
                  : 'strategy-filter__button'
              }
              type="button"
              aria-pressed={isActive}
              key={strategy.id}
              onClick={() => onStrategyChange(strategy.id)}
            >
              <strong>{strategy.name}</strong>
              <span>{strategy.description}</span>
            </button>
          )
        })}
      </div>

      {activeStrategy ? (
        <div className="strategy-filter__active">
          <strong>当前策略：{activeStrategy.name}</strong>
          <span>{activeStrategy.description}</span>
        </div>
      ) : null}
    </section>
  )
}

export default ProductStrategyFilter
