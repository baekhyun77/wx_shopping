// pages/myCollection/myCollection.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: [],

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
   * 加载用户的关注列表
   */
  loadUserCollection() {
    let _this = this
    wx.request({
      url:  app.globalData.baseUrl + '/collection/getCollectionByUserId',
      method: 'POST',
      data: {
        collection_userid: app.store.getState().user_id
      },
      success(resp) {
        _this.setData({
          collectionList: resp.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadUserCollection()
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