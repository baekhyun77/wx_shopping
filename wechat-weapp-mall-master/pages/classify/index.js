//获取应用实例
var app = getApp()
Page({
    data: {
        goodList:[], //商品列表
        inputSearch: '', //搜索内容
        typeList:''
    },
 
    //事件处理函数
    swiperchange: function(e) {
        
    },

    switchRightTab(e) {
        const _this = this
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/getCommodityByType',
            method:'GET',
            data:{commodity_typename: e.currentTarget.dataset.name },
            success(res) {
                // console.log(res.data);
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

    showDetail: function(e) {
        wx.navigateTo({
            url: '../details/details?commodity_id=' +  e.currentTarget.dataset.pid
        })
    },

    search: function() {
        const _this = this
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/queryCommodity',
            method:'GET',
            data:{searchContent: this.data.inputSearch  },
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
     * 获取类型
     */
    getAllType() {
        var _this = this;
        wx.request({
          url: getApp().globalData.baseUrl + '/type/getAllType',
          method:'GET',
          success(res) {
            _this.setData({
                typeList : res.data
            })
          }
        })
    },

    onLoad: function() {
       
    },

    onShow: function() {
        this.search();
        this.getAllType();
    }
})
