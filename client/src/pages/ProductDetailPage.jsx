import { useParams } from 'react-router-dom'

function ProductDetailPage() {
  //useParams()拿到当前路由里面的动态参数对象，并从中解构出 id 参数
  const { id } = useParams()

  return (
    <section className="page">
      <h2 className="page-title">商品详情</h2>
      <p className="page-description">
        这里将展示单个商品的利润、风险和推荐信息。
      </p>
      <p className="page-note">当前商品 id 为：{id}</p>
      <p className="page-description">Day 8 先通过动态路由读取 URL 参数，不请求详情接口。</p>
    </section>
  )
}

export default ProductDetailPage
