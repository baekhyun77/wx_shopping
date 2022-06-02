
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_show: getApp().store.getState().user_show,
    user_name: getApp().store.getState().user_name,
    user_password: getApp().store.getState().user_password,
    user_phone: getApp().store.getState().user_phone,
    user_email: getApp().store.getState().user_email,
    user_image: getApp().store.getState().user_image,
    user_address: getApp().store.getState().user_address,
  },

  /**
   * 前往修改页面
   * @param {} e 
   */
  _prefect: function(e) {
    wx.navigateTo({
      url: './updateUserInfo/index?type=' +  e.currentTarget.dataset.type + '&content=' + e.currentTarget.dataset.content,
    })
  },
  _goAddress:function(e){
    wx.navigateTo({
      url: '/pages/myAddress/myAddress',
    })
  },
  onLoad: function(options) {
    console.log(getApp().store.getState().user_show)
  },

  onShow: function(e) {
    console.log(this.data)
  },
})