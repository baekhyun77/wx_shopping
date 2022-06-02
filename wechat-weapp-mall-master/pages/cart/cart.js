// pages/cart/cart.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],//购物车列表

  },

  /**
   * 直接修改status 为 1
   *  {"title":"全部", "status":"9"}, 
      {"title":"待发货", "status":"1"}, 
      {"title":"待收货","status":"2"}, 
      {"title":"待评价", "status": "3"},
      {"title":"已完成", "status": "4"}
   * @param {传过来的id} e 
   */
  toPurchase(e) {
    var _this = this
    
    wx.request({
      
    url: app.globalData.baseUrl + '/order/updateOrderStatus',
    method:'POST',
    data: {
      order_id: e.currentTarget.dataset.id,
      order_status: '1',
      order_commoditystatus:e.currentTarget.dataset.order_commoditystatus
    },


    success(res) {
      wx.showToast({
        title: '购买成功！',
      })
      _this.load()
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
        _this.load()
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

  load() {
    let _this = this
    wx.request({
      url:  app.globalData.baseUrl + '/order/queryOrder',
      data: {
        order_userid: app.store.getState().user_id,
        order_status: "0", //0 为购物车
      },
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
  onShow() {
    this.load()
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