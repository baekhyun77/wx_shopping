//获取应用实例
var app = getApp()
Page({
    data: {
        goodList:[], //商品列表
        shop_id: '', //搜索类容
        shop_name: '',
        shop_image: '',
        shop_describe: '',
        shop_turnover: '',
        shop_userid: '',
        shop_username: '',
        shop_visits: '',
        shop_address: '',
        shop_phone: '',
        alreadyCollection: false
    },

    addUserCollection() {
      let _this = this
      wx.request({
        url:getApp().globalData.baseUrl + '/collection/addCollection',
        method: 'POST',
        data: {
          collection_userid : app.store.getState().user_id,
          collection_shopid : this.data.shop_id,
          collection_shopname : this.data.shop_name,
          collection_shopimage : this.data.shop_image
        },
        success(res) {
          _this.setData({
            alreadyCollection: true
          })
          wx.showToast({
            title:'关注成功'
          })
        }
      })
    },

    deleteCollection() {
      let _this = this
      wx.request({
        url: getApp().globalData.baseUrl + '/collection/deleteCollection',
        method:'POST',
        data: {
          collection_userid :  app.store.getState().user_id,
          collection_shopid :  this.data.shop_id,
        },
        success(res) {
          if(res.data == '1') {
            _this.setData({
              alreadyCollection: false
            })
            wx.showToast({
              title:'取关成功'
            })
          }
        }
      })
    },

    //事件处理函数
    swiperchange: function(e) {
        
    },

    showDetail: function(e) {
        wx.navigateTo({
            url: '../details/details?commodity_id=' +  e.currentTarget.dataset.pid
        })
    },

    /**
     * 获取店铺中的商品
     */
    search: function() {
        const _this = this
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/getCommodityByShopId',
            method:'GET',
            data:{id: this.data.shop_id  },
            success(res) {
                console.log(res.data);
                _this.setData({ //无法在success里面直接用this，因为success有自己的this。
                    goodList: res.data
                })
            },
            fail(res) {
                wx.showToast({
                  title: '网络异常',
                  icon : "none"
                })
              }
          })
    },

    /**
     * 获取店铺的信息
     */
    getShopInfo() {
      const _this = this
      wx.request({
          url: getApp().globalData.baseUrl + '/shop/getShopById',
          method:'GET',
          data:{id: this.data.shop_id  },
          success(res) {
              // console.log(res.data);
              _this.setData({ //无法在success里面直接用this，因为success有自己的this。
                shop_name: res.data.shop_name,
                shop_image:  res.data.shop_image,
                shop_describe:  res.data.shop_describe,
                shop_turnover:  res.data.shop_turnover,
                shop_userid:  res.data.shop_userid,
                shop_username:  res.data.shop_username,
                shop_visits:  res.data.shop_visits,
                shop_address:  res.data.shop_address,
                shop_phone:  res.data.shop_phone,
              });
              wx.setNavigationBarTitle({
                title: res.data.shop_name,
              })
          },
          fail(res) {
              wx.showToast({
                title: '网络异常',
                icon : "none"
              })
            }
        })
    },

    /**
     * 查询用户是否已经关注店铺
     */
    getUserCollection() {
      let _this = this
      wx.request({
        url:getApp().globalData.baseUrl + '/collection/getCollectionByUserId',
        method:'POST',
        data: { collection_userid: app.store.getState().user_id,},
        success(resp) {
          for(let i = 0; i < resp.data.length; i++ ) {
            if(_this.data.shop_id == resp.data[i].collection_shopid) {
              _this.setData({
                alreadyCollection: true
              })
              break;
            }
          }
        },
      })
    },
    
    onLoad: function(options) {
      this.setData({
        shop_id: options.shop_id
       })
    },

    onShow: function(options) {
        this.getShopInfo();
        this.search();
        this.getUserCollection()
    }
})
