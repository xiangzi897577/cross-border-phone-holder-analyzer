function StatCard({ title, value, description }) {
  return (
    <article className="stat-card">
      <p className="stat-card__title">{title}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__description">{description}</p>
    </article>
  )
}

export default StatCard
