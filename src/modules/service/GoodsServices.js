// import Fetch from './Fetch.js'
import Http from './Http.js'
import url from './Api.js'

class Shop {
  // 获取商品列表
  static GetGoodsList (data) {
    return Http.post(url.GetGoodsList, data)
  }
  // 获取商品规格
  static GetGoodsSpec (data) {
    return Http.post(url.GetGoodsSpec, data)
  }
}

export default Shop
