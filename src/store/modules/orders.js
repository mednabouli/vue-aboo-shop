import Common from 'modules/service/CommonServices.js'
import Order from 'modules/service/OrderServices.js'

const orders = {
  namespaced: true,
  state: {
    ordersLists: null,
    orderADetail: null,
    orderBList: null,
    isSubmit: false
  },
  getters: {
    // modifyOrderLists: state => {
    //   let { ordersLists } = state
    //   if (ordersLists) {
    //     let arr = []
    //     let date
    //     ordersLists.forEach(order => {
    //       let { CreateTime, Img, OrderId, Price, Sign, Status } = order
    //       date = Number.parseInt(CreateTime + '000')
    //       arr.push({
    //         createTime: Common.handleCreateTimeText(date),
    //         img: Img,
    //         orderId: OrderId,
    //         price: `￥${Number.parseFloat(Price).toFixed(2)}`,
    //         sign: Sign,
    //         status: Common.handleOuterStatus(Status),
    //         payType: '在线支付'
    //       })
    //     })
    //     return arr
    //   }
    //   return []
    // },
    // modifyOrderADetail: state => {
    //   let { orderADetail } = state
    //   if (orderADetail) {
    //     let { Address, CreateTime, Phone, Price, Status } = orderADetail
    //     let address = JSON.parse(Address)
    //     let date = Number.parseInt(CreateTime + '000')
    //     return {
    //       address: `${address.Province} ${address.City} ${address.Area} ${address.Detail} ${address.NickName} ${address.Phone}`,
    //       createTime: Common.handleCreateTimeText(date),
    //       payType: '在线支付',
    //       phone: Phone,
    //       price: `￥${Number.parseFloat(Price).toFixed(2)}`,
    //       status: Common.handleOuterStatus(Status)
    //     }
    //   }
    //   return null
    // },
    // modifyOrderBLists: state => {
    //   let { orderBList } = state
    //   if (orderBList && orderBList.length) {
    //     let arr = []
    //     orderBList.slice(0).forEach(orderItem => {
    //       let { Desc, GoodsId, GoodsName, Img, Price, Status } = orderItem
    //       arr.push({
    //         desc: Desc,
    //         goodsId: GoodsId,
    //         goodsName: GoodsName,
    //         img: Img,
    //         number: orderItem.Number,
    //         price: `￥${Number.parseFloat(Price).toFixed(2)}`,
    //         subTotal: `￥${Number.parseFloat(orderItem.Number * Price).toFixed(2)}`,
    //         status: Common.handleInnerStatus(Status)
    //       })
    //     })
    //     return arr
    //   }
    //   return []
    // }
  },
  mutations: {
    handleSubmit (state, status) {
      state.isSubmit = status
    },
    generateOrdersListsMutation (state, ordersLists) {
      let modifyOrderLists = instance => {
        let arr = []
        let date
        ordersLists.forEach(order => {
          let { CreateTime, Img, OrderId, Price, Sign, Status } = order
          date = Number.parseInt(CreateTime + '000')
          arr.push({
            createTime: Common.handleCreateTimeText(date),
            img: Img,
            orderId: OrderId,
            price: `￥${Number.parseFloat(Price).toFixed(2)}`,
            sign: Sign,
            status: Common.handleOuterStatus(Status),
            payType: '在线支付'
          })
        })
        return arr
      }
      state.ordersLists = modifyOrderLists(ordersLists)
    },
    generateOrderDetailMutation (state, instance) {
      let { orderADetail, orderBList } = instance
      // orderADetail
      let modifyOrderADetail = instance => {
        let { Address, CreateTime, Phone, Price, Status } = instance
        let address = JSON.parse(Address)
        let date = Number.parseInt(CreateTime + '000')
        return {
          address: `${address.Province} ${address.City} ${address.Area} ${address.Detail} ${address.NickName} ${address.Phone}`,
          createTime: Common.handleCreateTimeText(date),
          payType: '在线支付',
          phone: Phone,
          price: `￥${Number.parseFloat(Price).toFixed(2)}`,
          status: Common.handleOuterStatus(Status)
        }
      }
      let mofifyOrderBList = instance => {
        // orderBList
        let arr = []
        instance.slice(0).forEach(orderItem => {
          let { Desc, GoodsId, GoodsName, Img, Price, Status } = orderItem
          arr.push({
            desc: Desc,
            goodsId: GoodsId,
            goodsName: GoodsName,
            img: Img,
            number: orderItem.Number,
            price: `￥${Number.parseFloat(Price).toFixed(2)}`,
            subTotal: `￥${Number.parseFloat(orderItem.Number * Price).toFixed(2)}`,
            status: Common.handleInnerStatus(Status)
          })
        })
        return arr
      }
      state.orderADetail = modifyOrderADetail(orderADetail)
      state.orderBList = mofifyOrderBList(orderBList)
    }
  },
  actions: {
    generateOrdersListsAction ({ dispatch, commit, rootState }, limit) {
      commit('generateUserInfoCheck', null, { root: true })
      let userId = rootState.userInfo.UserId
      commit('handleLoading', null, { root: true })
      Order.GetOrderList({userId}).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.ret === 1001) {
          commit('generateOrdersListsMutation', res.data)
        }
        if (res.ret === 1002) {
          commit('generateOrdersListsMutation', null)
        }
      })
    },
    generateOrdersDetailAction ({ dispatch, commit, rootState }, orderId) {
      commit('generateUserInfoCheck', null, { root: true })
      let userId = rootState.userInfo.UserId
      commit('handleLoading', null, { root: true })
      Order.GetOrderDetail({userId, orderId}).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.ret === 1001) {
          commit('generateOrdersDetailMutation', res)
        }
        if (res.ret === 1002) {
          window.confirm(res.code)
        }
      })
    },
    handleOrdersAddAction ({ dispatch, commit, state, rootGetters }, cartLists) {
      if (state.isSubmit) {
        return window.confirm('您已经成功提交订单，请不要重复提交。')
      }
      commit('generateUserInfoCheck', null, { root: true })
      let { userId, addressId } = rootGetters['address/defaultAddress']
      commit('handleLoading', null, { root: true })
      let goodsId = []
      let specId = []
      let specName = []
      let number = []
      let desc = []
      cartLists.forEach(good => {
        goodsId.push(good.goodsId)
        specId.push(good.specId)
        specName.push(good.specName)
        number.push(good.number)
        desc.push('')
      })
      let instance = {
        userId,
        addressId,
        goodsId: goodsId.join('##'),
        specId: specId.join('##'),
        specName: specName.join('##'),
        number: number.join('##'),
        desc: desc.join('##')
      }
      Order.AddOrder(instance).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.ret === 1001) {
          // this.isSubmit = true
          commit('handleSubmit', true)
          window.confirm(res.code)
          // this.$router.push({
          //   name: 'pay', params: { sign: res.sign, instance: res }
          // })
        }
        if (res.ret === 1002) {
          window.confirm(res.code)
        }
      })
    }
  }
}

export default orders