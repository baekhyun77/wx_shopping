var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: '',
    userListInfo: [ {
      icon: '../../images/iconfont-dingdan.png',
      text: '我的订单',
      url: '../allOrder/order'
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理',
        url: '../myAddress/myAddress'
      }, {
        icon: '../../images/footer-icon-04.png',
        text: '我的信息',
        url: '../setting/setting'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '入驻我们',
        url: '../join/join'
      }, {
        icon: '../../images/msg.svg',
        text: '我的消息',
        url: '../myChat/myChat'
      }, {
        icon: '../../images/collection.svg',
        text: '我的关注',
        url: '../myCollection/myCollection'
      },{
        icon: '../../images/iconfont-kefu.png',
        text:'帮助与反馈',
        url: '../notice/notice'
      }
    ]
  },

  addIntegral() {
    var _this = this
    wx.request({
      url: getApp().globalData.baseUrl + '/integral/insertJoin',
      method: 'POST',
      data: {
        integral_user_id: app.store.getState().user_id, //获取全局状态 使用全局方法wxml文件
        integral_user_name: app.store.getState().user_name,
      }, 
      success(res) {
        if(res.data == '1') {
          wx.showToast({
            title: "积分 +2"
          })
          var integral = parseFloat(app.store.getState().user_integral) + 2;
          app.store.setState({
            user_integral: integral
          })
        }
        else {
          wx.showToast({
            title: res.data,
            icon:'none'
          })
        }
      }
    })
  },

  /**
   * 自定义属性传参
   * @param {*} url1 组件通过 data-参数名 来传递参数给事件
   */
  routerTo: function(url1) {
    console.log(url1.currentTarget.dataset)
    let target = url1.currentTarget.dataset["url"]
    wx.navigateTo({
      url: target,
    })
  },

  loginout: function() {
    wx.navigateTo({
      url: '../login/login',
    })

  },



  /**
   * 修改图像，更新store同时更新数据库中的数据
   */
  uploadImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: getApp().globalData.baseUrl+'/imgUpload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success (res){
            let str = res.data.split("\""); //数组分割。
            app.store.setState({
              user_image : getApp().globalData.baseUrl + "/" + str[1]
            })
            wx.request({
              url: app.globalData.baseUrl + '/user/updateUserInfo',
              method: 'POST',
              data: {
                user_id : app.store.getState().user_id,
                user_image: getApp().globalData.baseUrl + "/" + str[1]
              },
            })
          }
        })
      }
    })
  },

  onLoad: function() {
  }
})