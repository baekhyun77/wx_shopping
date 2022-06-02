
const app = getApp();

Page({

  data: {
    startX: 0, //开始坐标
    startY: 0,
    loading: true,
    addressList: []
  },
  onLoad: function(options) {

  },

  /**
   * 删除
   */
  _deleteAddress(e) {
    var _this = this
    wx.request({
      url: app.globalData.baseUrl + '/address/deleteAddress',
      data: {id : e.currentTarget.dataset["pid"]},
      success(res) {
        _this._getAddressListById()
      },
      fail(res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 前往添加页面
   */
  _goAddAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },

  onShow: function() {
    this._getAddressListById()
  },

  /**
   * 获取个人地址数据
   */
  _getAddressListById: function() {
    const _this = this
    wx.request({
      url: app.globalData.baseUrl + '/address/getAddressByUserId',
      data: {id : app.store.getState().user_id},
      success(res) {
        console.log(res);
        _this.setData({
          addressList : res.data
        })
      },
      fail(res) {
        wx.showToast({
          title: '网络异常',
          icon: "none"
        });
      }
    })
  }
})