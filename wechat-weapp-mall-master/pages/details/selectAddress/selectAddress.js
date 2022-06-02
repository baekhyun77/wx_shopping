
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
      let pagetotal = getCurrentPages(),//获取盏队
      thispage = pagetotal[pagetotal.length - 1],//子页面
      parpage = pagetotal[pagetotal.length - 2]//父页面

      parpage.setData({
        order_addressid: e.currentTarget.dataset.pid,
        order_addressconsignee: e.currentTarget.dataset.user,
        order_addressdetails: e.currentTarget.dataset.details,
        order_addressname:e.currentTarget.dataset.address,
        order_addressphone:e.currentTarget.dataset.phone,
      })
      wx.navigateBack({
        delta: 1,
      })
  },

  /**
   * 前往添加页面
   */
  _goAddAddress() {
    wx.navigateTo({
      url: '../../addAddress/addAddress',
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