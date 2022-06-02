// pages/register/register.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      user_show: '',
      user_name: '',
      user_password: '',
      user_passwordTrue: '',
      user_phone: '',
      user_payword:'',
      user_email: '',
      user_image: '',
      user_address: '',
    
  },
  /**
   * 注册表单提交
   */
  registerUser: function() {
    let User = {
      user_show: this.data.user_show,
      user_name: this.data.user_name,
      user_password: this.data.user_password,
      user_phone: this.data.user_phone,
      user_payword:this.data.user_payword,
      user_email: this.data.user_email,
      user_rootid: '3',//默认普通用户
      user_image: this.data.user_image,
      user_address: this.data.user_address,
      user_status: '1'//默认开启
    }
    console.log(User.user_show)

    if(User.user_image == "") {
      wx.showToast({
        title: '请上传头像',
        icon : "none"
      })
    }
    
    
    else if(User.user_show == "") {
      wx.showToast({
        title: '请输入昵称',
        icon : "none"
      })
    }
    else if(User.user_email == "" || !/^[1-9a-zA-Z_]\w*@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/.test(User.user_email)) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon : "none"
      })
    }
    else if(User.user_name == "") {
      wx.showToast({
        title: '请输入登录名',
        icon : "none"
      })
    }
    else if(User.user_password == "") {
      wx.showToast({
        title: '请输入密码',
        icon : "none"
      })
    }
    else if(User.user_password != this.data.user_passwordTrue) {
      wx.showToast({
        title: '密码确认不通过',
        icon : "none"
      })
    }
    else if(User.user_phone == "" || !/^1[34578]\d{9}$/.test(User.user_phone)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon : "none"
      })
    }
    else if(User.user_address == "") {
      wx.showToast({
        title: '请输入地址',
        icon : "none"
      })
    }
    else if(User.user_payword==""||!/^\d+$/.test(User.user_payword)){
      wx.showToast({
        title: '请输入支付密码（数字形式）',
        icon : "none"
      })
    }
    else if(User.user_payword.length!=6){
      wx.showToast({
        title: '请输入六位支付密码',
        icon : "none"
      })
    }
    else {
      wx.request({
        url: getApp().globalData.baseUrl + '/user/userRegister',
        method: "POST",
        data: User,
        success(res) {
          console.log(res)
          if(res.data == "2") {
            wx.showToast({
              title: '手机号已经被注册！',
              icon : "none"
            })
          }
          else if(res.data=="3"){
            wx.showToast({
              title: '该昵称已经被注册！',
              icon : "none"
            })
          }
          else {
            wx.showToast({
              title: '注册成功',
              icon : "none"
            })
            wx.navigateTo({
                        url: '../login/login',
                      })
          }
          
        },
        fail(res) {
          wx.showToast({
            title: '网络异常',
            icon : "none"
          })
        }
      })
    }

  },

  toLogin: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /**
   * 图像上传功能
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
            //数据赋值，必须这样子，就很难受
            let user_image = 'user_image'
            let str = res.data.split("\""); //数组分割。
            that.setData({
             [user_image] : getApp().globalData.baseUrl + "/" + str[1]
            })
            //do something
            console.log(that.data.user_image)
          }
        })
      }
    })
    
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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