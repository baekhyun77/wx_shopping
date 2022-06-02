//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    notice_status: '',
    notice_message:'',
    noticeList: [],
  },
  onLoad(){
 
  },

  onShow:function(){
    // let _this = this
    // wx.request({
    //   url:  app.globalData.baseUrl + '/notice/getNoticeByUserId',
    //   method: 'POST',
    //   data: {
    //     collection_userid: app.store.getState().user_id
    //   },
    //   success(resp) {
    //     _this.setData({
    //       noticeList: resp.data
    //     })
    //   }
    // })  
  },

  insertNotice() {
    var _this = this;
    wx.request({
      url: app.globalData.baseUrl + '/notice/insertNotice',
      method:'POST',
      data:{
        noice_user_id: app.store.getState().user_id,
        notice_user_name:app.store.getState().user_name,
        notice_message: this.data.notice_message,
        notice_status: '0',
      },
      success(res) {
        wx.showToast({
          title: '已提交信息',
          icon : "none"
        })
      }
    })
  },
  //事件处理函数
  toSearch(e){
    this.setData({
      isTap:true
    });
    wx.navigateTo({
      url: "../search/search"
    })
  },

})
