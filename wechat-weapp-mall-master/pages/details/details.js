// pages/goods/show.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodity_id:'',
    commodity_name:'',
    commodity_price:'',
    commodity_userid:'',
    commodity_typename:'',
    commodity_typeid:'',
    commodity_num:'',
    commodity_image:'',
    commodity_shopid:'',
    commodity_shopname:'',
    commodity_describe:'',
    commodity_group:'',
    commodity_discount:'',
    commodity_group_num: '',
    commodity_sales:'',
    commodity_status:'',
    commodity_time:'',
  },

  /**
   * 前往客服聊天界面
   * @param {*} e 
   */
  goChat(e) {

      wx.navigateTo({
        url: "../chat/chat?toUserId=" + this.data.commodity_userid //将商品id传过去 记住 = 那里不能有空格 千万不能有
      })
    
  },
  /**
   * 前往购物车
   */
  toAddCart(e){
    
    const _this=this
    wx.request({
      url: getApp().globalData.baseUrl + '/shop/getShopByUserId',
      method:'GET',
      data:{id: app.store.getState().user_id  },
      success(res) {
          console.log(res.data.shop_id)
          if(_this.data.commodity_shopid == res.data.shop_id)
          {
            wx.showToast({
              title: '无法购买本人店铺商品',
              icon : "none"
            })
            return false
          }
          else{
            if(_this.data.commodity_status==0){
              wx.showToast({
                title: '商品已下架',
                icon : "none"
              })
            }else{
              wx.navigateTo({
                url: "./addCart/addCart?commodity_id=" + _this.data.commodity_id //将商品id传过去 记住 = 那里不能有空格 千万不能有
              })
            }
          }
      }
    })

    
  },
  toAddIntegral(e) {
    const _this=this
    wx.request({
      url: getApp().globalData.baseUrl + '/shop/getShopByUserId',
      method:'GET',
      data:{id: app.store.getState().user_id  },
      success(res) {
          console.log(res.data.shop_id)
          if(_this.data.commodity_shopid == res.data.shop_id)
          {
            wx.showToast({
              title: '无法购买本人店铺商品',
              icon : "none"
            })
            return false
          }
          else{
            if(_this.data.commodity_status==0){
              wx.showToast({
                title: '商品已下架',
                icon : "none"
              })
            }else{
              wx.navigateTo({
                url: "./integral/integral?commodity_id=" + _this.data.commodity_id //将商品id传过去 记住 = 那里不能有空格 千万不能有
              })
            }
          }
      }
    })
    
  },
  toAddPurchase(e) {
    const _this=this
    wx.request({
      url: getApp().globalData.baseUrl + '/shop/getShopByUserId',
      method:'GET',
      data:{id: app.store.getState().user_id  },
      success(res) {
          console.log(res.data.shop_id)
          if(_this.data.commodity_shopid == res.data.shop_id)
          {
            wx.showToast({
              title: '无法购买本人店铺商品',
              icon : "none"
            })
            return false
          }
          else{
            if(_this.data.commodity_status==0){
              wx.showToast({
                title: '商品已下架',
                icon : "none"
              })
            }else{
              wx.navigateTo({
                url: "./purchase/purchase?commodity_id=" + _this.data.commodity_id //将商品id传过去 记住 = 那里不能有空格 千万不能有
              })
            }

          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        commodity_id : options.commodity_id,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //把用户选好的商品规格从缓存拿出来
  onShow: function () {
    let _this = this;
    wx.request({
      url:  app.globalData.baseUrl + '/commodity/userGetCommodity',
      method: 'GET',
      data:{id: this.data.commodity_id},
      success(res) {
        _this.setData({
            commodity_name : res.data.commodity_name,
            commodity_price : res.data.commodity_price,
            commodity_userid : res.data.commodity_userid,
            commodity_typename : res.data.commodity_typename,
            commodity_typeid : res.data.commodity_typeid,
            commodity_num : res.data.commodity_num,
            commodity_image : res.data.commodity_image,
            commodity_shopid : res.data.commodity_shopid,
            commodity_shopname : res.data.commodity_shopname,
            commodity_describe : res.data.commodity_describe,
            commodity_group : res.data.commodity_group,
            commodity_discount : res.data.commodity_discount,
            commodity_sales : res.data.commodity_sales,
            commodity_status : res.data.commodity_status,
            commodity_time : res.data.createTime,
            commodity_group_num: res.data.commodity_group_num
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