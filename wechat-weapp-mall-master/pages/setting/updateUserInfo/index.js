
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : '',
    type: ''
  },
  updateUserInfo: function() {
    let param = this.data.type;
    let User = {};
    User[this.data.type] = this.data.content;//将传参的参数名动态化
    User.user_id = app.store.getState().user_id
    wx.request({
      url: app.globalData.baseUrl + '/user/updateUserInfo',
      method: "POST",
      data: User,
      success(rtn) {
        if(rtn.data == "1") {
          wx.request({
            url: app.globalData.baseUrl + '/user/getUserInfo',
            data: {id :app.store.getState().user_id },
            success(res) {
              getApp().store.setState({
                user_name: res.data.user_name,
                user_id: res.data.user_id,
                user_show: res.data.user_show,
                user_image: res.data.user_image,
                user_address: res.data.user_address,
                user_phone: res.data.user_phone,
                user_email: res.data.user_email,
                user_status: res.data.user_status,
                user_rootid: res.data.user_rootid,
              });
            }
          })
          // 返回
          wx.navigateBack({
            delta: 1
          })
        }
        else {
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
        }
      }
    })
  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      content: options.content,
      type: options.type
    })
  },
})