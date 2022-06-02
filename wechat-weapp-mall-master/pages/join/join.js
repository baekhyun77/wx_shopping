//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    join_status: '',
    join_reason:'',
  },
  onLoad(){
    
  },



  insertJoin() {
    var _this = this;
    wx.request({
      url: app.globalData.baseUrl + '/join/insertJoin',
      method:'POST',
      data:{
        join_userid: app.store.getState().user_id,
        join_username:app.store.getState().user_name,
        join_reason:this.data.join_reason,
        join_status: '0',
      },
      success(res) {
        _this.setData({
          join_status:'0'
        })
      }
    })
  },

  onShow(e){
    var _this = this;
    wx.request({
      url:  app.globalData.baseUrl + '/join/getAllJoinByUserId',
      method:'GET',
      data:{id: app.store.getState().user_id,},
      success(res) {
        console.log(res.data)
        if(res.data.join_status != null ) {
          _this.setData({
            join_status: res.data.join_status
          })
        }
      }
    })



    this.setData({
      isTap:false
    });
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
