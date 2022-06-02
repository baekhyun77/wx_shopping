
import wxValidato from '../../utils/WxValidate'
// 为小程序表单提供了一套常用的验证规则

Page({
  data:{
    loginBtnTxt:"登陆",
    loginBtnBgBgColor:"#1CBCB4",
    btnLoading:false,
    disabled:false, // 按钮启用状态
    inputUserName: '',
    inputPassword: '',
  },

  formSubmit: function(e) {
    let params = e.detail.value;
    params.user_status = '1';
    // 表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束
    if(params.user_phone == '' || !/^1[34578]\d{9}$/.test(params.user_phone)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: "none"
      })
    }
    else if(params.user_password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
    }
    else {
      wx.request({
        url: getApp().globalData.baseUrl + '/user/userLogin',
        data: params,
        method: "POST",
        success(res) {
          console.log(res);
          if(res.data == "") {
            wx.showToast({
              title: '用户名或密码错误！',
              icon: 'none'
            })
            
          } 
          else if(res.data.user_status=='0'){
              wx.showToast({
                title: '用户名或密码错误！',
                icon: 'none'
              })
          }
          else {
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
              user_integral: res.data.user_integral,
            });
            wx.switchTab({
              url: '../index/index',
            })
          }

        },
        fail(res) {
          wx.showToast({
            title: '网络异常',
            icon: "none"
          })
        }
      })
    }
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },
 
})