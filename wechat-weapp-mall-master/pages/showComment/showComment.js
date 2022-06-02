// pages/showComment/showComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    commodity_id:'',
    starst: [//评分描述配置
      {index : 0 },
      {index : 1 },
      {index : 2 },
      {index : 3 },
      {index : 4 },
   ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
    var _this = this
    wx.request({
      url:  app.globalData.baseUrl + '/comment/queryComment',
      method:'GET',
      data: {comment_commodityid: this.data.commodity_id},
      success(res) {
        _this.setData({
          commentList: res.data
        })
      }
    })
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