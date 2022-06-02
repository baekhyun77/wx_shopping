// pages/allOrder/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    // winHeight: windowHeight(),
    orderStatus: [
     // {"title":"全部", "status":"9"}, 
      {"title":"待发货", "status":"1"}, 
      {"title":"待收货","status":"2"}, 
      {"title":"待评价", "status": "3"},
      {"title":"已完成", "status": "4"},
      {"title":"已退款", "status": "5"}
    ],
    status: '9', //代表全部
    orderList: [],//购物车列表
    
  },

  /**
   * 跳转到添加评论的页面。将订单id带过去。
   * @param {*} e 
   */
  toAddComment(e) {
    wx.navigateTo({
      url: './addComment/addComment?order_id=' + e.currentTarget.dataset.id + '&commodity_id=' + e.currentTarget.dataset.commodityid,
    })
  },
  toLookComment(e) {
    wx.navigateTo({
      url: '../showComment/showComment?commodity_id='+e.currentTarget.dataset.commodityid,
    })
  },
  /**
   * 
   * @param {退款功能} e。绑定的订单id 
   */
  refund(e) {
    let _this = this
    wx.request({
      url: app.globalData.baseUrl + '/order/getOrderById',
      method:"GET",
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success(res) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@")
        console.log(res.data.order_status)
        if(res.data.order_status == 1){
          wx.request({
            url: app.globalData.baseUrl + '/order/refund',
            method:'POST',
            data: {
              order_id: e.currentTarget.dataset.id,
              order_status: '5',
            }, 
            success(res) {
              _this.loadOrder() //重新加载一下数据
              wx.showToast({
                title: '货款已从原渠道返回',
                icon:'success'
              })
            },
            fail(res) {
              wx.showToast({
                title: '网络异常',
                icon:'none'
              })
            }
          })
        }
        else{
          wx.showToast({
            title: '商品已发货，无法退款',
            icon:'none'
          })
        }
      },
      })
  },

  /**
   * 用户收货。流程，将订单的状态改变为3 即已经收货，待评价。
   */
  receivingGoods(e) {
    let _this = this
    
    wx.request({
      url: app.globalData.baseUrl + '/order/updateOrderStatus',
      method:'POST',
      data: {
        order_id: e.currentTarget.dataset.id,
        order_status: '3',
      },
      success(res) {
        _this.loadOrder() //重新加载一下数据
        wx.showToast({
          title: '收货成功',
          icon:'success'
        })
      },
      fail(res) {
        wx.showToast({
          title: '网络异常',
          icon:'none'
        })
      }
    })
  },

   /**
   * 删除。直接传id去删就行，在所有购物车的页面进行删除
   */
  delete(e) {
    var _this = this
    wx.request({
      url: app.globalData.baseUrl + '/order/deleteFromCart',
      method:"GET",
      data: {
        id: e.currentTarget.dataset.id
      },
      success(res) {
        wx.showToast({
          title: '删除成功！',
        })
        _this.loadOrder()
      },
      fail(res) {
        wx.showToast({
          title: '网络异常',
          icon:'none'
        })
      }
    })
  },

  /**
   * 加载数据
   */
  loadOrder() {
    let _this = this
    let order = {
      order_userid: app.store.getState().user_id,
    }
    if(this.data.status == "1") {
      order.order_status = "1"
    }
    if(this.data.status == "2") {
      order.order_status = "2"
    }
    if(this.data.status == "3") {
      order.order_status = "3"
    }
    if(this.data.status == "4") {
      order.order_status = "4"
    }
    if(this.data.status == "5") {
      order.order_status = "5"
    }

    wx.request({
      url:  app.globalData.baseUrl + '/order/queryOrder',
      data: order,
      method:'POST',
      success(res) {
        console.log(res.data)
        _this.setData({
          orderList : res.data
        })
      },
      fail(res) {
        wx.showToast({
          title: '网络异常',
          icon:'none'
        })
      }
    })
  },

   

  /**
   * 前往详情页面
   * @param {*} e 
   */
  toDetails(e) {
    wx.navigateTo({
      
      url: '../details/details?commodity_id=' +  e.currentTarget.dataset.id
      
    })

  },


    //类目切换
    swichNav: function(e) {
      var cur = e.target.dataset.current
      if (this.data.currentTab == cur) {
        return false
      }
      this.setData({
        currentTab: cur,
        status: e.currentTarget.dataset.status //修改订单的状态。
      })
      this.loadOrder() //通过订单的状态来获取订单。
      // console.log(e.currentTarget.dataset.status);
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})