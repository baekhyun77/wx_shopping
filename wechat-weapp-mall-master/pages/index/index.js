    // 小程序在启动前需要进行注册，而小程序的注册只能且必须在app.js中使用App()函数来处理，并且不能注册多个。小程序第一打开时将会下载整个小程序代码包，然后通过app.json配置初始化App，页面就会开始渲染首页，初始化完成后，执行App中onLauch()函数和onShow()函数，然后才执行页面中的onLoad()和onShow()，当小程序每次进入后台（当用户点击左上角关闭，或者按了设备 Home 键离开微信）都会先执行页面中的onHide()函数再执行app.js中的onHide()函数，每次进入前台都会先执行app.js中onShow()函数再执行页面中的onShow()函数。

//获取应用实例
var app = getApp()
Page({
    data: {
        topNum: 0,
        goodList:[], //商品列表
        inputSearch: '', //搜索内容
                // 这里改变当前显示第几个tab
        currentTab: 0,
        inforList:[]
        
    },
    /**
     * 
     * @param {推荐模块} e 
     */
    allCommodity() {
        let _this = this;
        _this.setData({
            currentTab: 0
        })
        _this.onShow()
    },
 // 获取滚动条当前位置
 onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
     this.setData({
      floorstatus: true
     });
    } else {
     this.setData({
      floorstatus: false
     });
    }
   },
  
   //回到顶部
   goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
     wx.pageScrollTo({
      scrollTop: 0
     })
    } else {
     wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
     })
    }
   },
  
  
    hotCommodity() {
        let _this = this;
        _this.setData({
            currentTab: 1
        })
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/hotCommodity',
            method: 'GET',
            success(res) {
                _this.setData({ //无法在success里面直接用this，因为success有自己的this。
                    goodList: res.data
                })
            },
        })
    },
    /**
     * 购买推荐，根据用户购买过的商品去进行推荐
     */
    likeCommodity() {
        let _this = this;
        _this.setData({
            currentTab: 3
        })
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/likeCommodity',
            data: {userId: app.store.getState().user_id},
            method: 'GET',
            success(res) {
                _this.setData({ //无法在success里面直接用this，因为success有自己的this。
                    goodList: res.data
                })
            },
        })
    },

    newCommodity() {
        let _this = this;
        _this.setData({
            currentTab: 2
        })
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/newCommodity',
            method: 'GET',
            success(res) {
                _this.setData({ //无法在success里面直接用this，因为success有自己的this。
                    goodList: res.data
                })
            },
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

    search: function() {
        const _this = this
        wx.request({
            url: getApp().globalData.baseUrl + '/commodity/queryCommodity',
            method:'GET',
            data:{searchContent: this.data.inputSearch  },
            success(res) {
                console.log(res.data);
                if(res.data.length==0)
                {
                    wx.showToast({
                        title: '暂无搜索结果',
                        icon : "none"
                      })
                   
                    this.search()
                    
                }
                _this.setData({ //无法在success里面直接用this， 因为success有自己的this。
                    goodList: res.data
                })
                _this.data.searchContent=""
            },
            fail(res) {
                wx.showToast({
                  title: '网络异常',
                  icon : "none"
                })
              }
            

          })
    },

    onLoad: function() {
        const _this=this
        wx.request({
            url: getApp().globalData.baseUrl + '/announce/getAllAnnounce',
            method:'GET',
            success(res) {
                console.log(res.data);
                _this.setData({ //无法在success里面直接用this， 因为success有自己的this。
                    inforList: res.data
                })
              
            },
          })
    },

    onShow: function() {
        this.search()
        this.onLoad()
    }
})
