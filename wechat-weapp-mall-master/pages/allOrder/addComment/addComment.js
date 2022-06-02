
// pages/star/star.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content : '',
    order_id: '',
    commodity_id: '',
    posit: 0,//评分的结束索引，实际从0开始，0表示选中第一个
    starst: [//评分描述配置
       "差评",
      "差评",
      "中评",
      "好评",
      "好评",
    ] 
  },
  //评分事件
  evclickt: function (event) {
    //console.log(event.target.dataset.posit)
    this.setData({ posit: event.target.dataset.posit })
  },

  /**
   * vue 中获取data中数据不带.data 小程序中要带
   */
  addComment() {
    let index = this.data.posit
    const _this = this
    wx.request({
      url:  app.globalData.baseUrl +  '/comment/addComment',
      method:'POST',
      data: {
        comment_orderid: _this.data.order_id,
        comment_commodityid: _this.data.commodity_id,
        comment_userid: app.store.getState().user_id,
        comment_username: app.store.getState().user_name,
        comment_userimage: app.store.getState().user_image,
        comment_stars: _this.data.posit + 1,
        comment_level: _this.data.starst[index],
        comment_content: _this.data.content,
      },
      success(res) {
        wx.request({
          url: app.globalData.baseUrl + '/order/updateOrderStatus',
          method:'POST',
          data: {
            order_id: _this.data.order_id,
            order_status: '4', //修改为4 已经完成一个完整的订单
          },
          success(res) {
            wx.navigateBack({
              delta: 1,
            }) //返回上一级
          },
          fail(res) {
            wx.showToast({
              title: '网络异常',
              icon:'none'
            })
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id,
      commodity_id: options.commodity_id,
    })
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