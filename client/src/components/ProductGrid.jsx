import ProductCard from './ProductCard.jsx'

function ProductGrid({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id ?? product.productName} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
