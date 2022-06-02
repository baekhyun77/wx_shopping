/**
 * Clay
 */
// const SocketTask = null;
 
var app = getApp();
let SocketTask
var socketOpen = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,  //屏幕高度
    chatHeight:0,//聊天屏幕高度
    fromUserId: '',//测试id 获取自己store中的id,
    fromUserName: '',
    fromUserIamge:'',
    toUserId: '', //这个id应该用页面传参带过来，
    msg: '', //聊天输入框
    msgList:[],//用来装载消息。
    chat_id: '',//连接的id、需要存入msg表、
    toUserName:'', //直接通过id查询获取，
    toUserImage:'',//保存消息。，

    sysTime: ''//系统时间
  },
  onLoad: function (options) {
    let _this = this;
      //获取屏幕的高度 系统信息
      wx.getSystemInfo({
        success(res) {
          _this.setData({
            height: wx.getSystemInfoSync().windowHeight,
            chatHeight: wx.getSystemInfoSync().windowHeight-55
          })
        }
      })
    _this.setData({
      fromUserId:  app.store.getState().user_id,
      fromUserName:  app.store.getState().user_name,
      fromUserIamge: app.store.getState().user_image,
      toUserId: options.toUserId,
    })
  },

  onShow: function() {
    //还需要，初始化toUser的信息，以及历史消息的信息。先获取ChatId，。然后在success中获取历史消息
    var _this = this;
    //初始化 连接信息和历史消息 每次打开时候都向服务端发送添加请求，服务端总会返回一个chat_id到前端，
    wx.request({
      url: app.globalData.baseUrl + '/chat/addChat',
      method:'POST',
      data: {
        chat_from_userid: this.data.fromUserId,
        chat_from_username: this.data.fromUserName,
        chat_from_userimage: this.data.fromUserIamge,
        chat_to_userid: this.data.toUserId, 
      },
      success(res) {
        _this.setData({ 
          chat_id: res.data, //后端永远会返回一个chatId. 接下来通过这个chatId来获取聊天的历史记录。以及保存消息到msg表中。
        })
        wx.request({
          url:  app.globalData.baseUrl + '/msg/getMsgByChat', //初始化历史消息
          method:"GET",
          data:{id : res.data},
          success(resp) {
            _this.setData({
              msgList:resp.data
            })
          },
          fail(res0) {
            wx.showToast({
              title: '网络异常！',
            })
          }
        })

      },
      fail(res) {
        wx.showToast({
          title: '网络异常！',
        })
      }
    })

    //初始化toUserId的信息。
    wx.request({
      url: app.globalData.baseUrl + '/user/getUserInfo',
      data: {id: this.data.toUserId},
      method: 'GET',
      success(res) {
        _this.setData({
          toUserName: res.data.user_name,
          toUserImage: res.data.user_image,
        })
        wx.setNavigationBarTitle({
          title: '与'+ res.data.user_name +'聊天中'
        });
      }
    })
  
    //创建socket连接。
    this.webSocket()
  },

  /**
   * 页面加载完成之后，创建socket连接
   * websocket也就是长连接，使用长连接后服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，那么就可以通过这个技术做一些及时性的功能
   * @param {*} options 
   */
  onReady: function(options) { 
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      //这里是接受服务器的消息，不需要保存到msg表，谁发的谁保存，但是需要保存到msgList当中。
      let _this = this
      _this.getSysTime()
      let sendMsg = {
        msg_id : '',
        msg_chatid: _this.data.chat_id,
        msg_userid: _this.data.toUserId,
        msg_username:  _this.data.toUserName, //收到的消息一直都是 chat 中的toUserId
        msg_userimage: _this.data.toUserImage,
        msg_text: onMessage.data,
        createTime: _this.data.sysTime
      }
      let list = this.data.msgList
      list.push(sendMsg)
      _this.setData({
        msgList: list
      })
     
    })
  },
  webSocket: function () {
        /**
     * 创建连接
     */
    SocketTask = wx.connectSocket({
      url: 'ws://127.0.0.1:8083/ws/' + this.data.fromUserId + "/" + this.data.toUserId,
      method: 'post', //这里方法用post?
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    });
  },

  /**
   * 发送消息
   */
  sendMsg: function() {
    console.log(this.data.msgList)
    let _this = this
    if( this.data.msg != '') {
    //这里是发消息的方法，需要将消息保存到msg表。谁发的谁保存的原则。
      wx.request({
        url: app.globalData.baseUrl + '/msg/addMsg',
        method: 'POST',
        data: {
          msg_chatid : this.data.chat_id,
          msg_userid : app.store.getState().user_id,
          msg_username :  app.store.getState().user_name,
          msg_userimage :  app.store.getState().user_image,
          msg_text : this.data.msg
        },
        success(res) {
          /**
           * 将消息push到 msgList中。
           */
          _this.getSysTime()
          let sendMsg = {
            msg_id : '',
            msg_chatid: _this.data.chat_id,
            msg_userid: app.store.getState().user_id,
            msg_username:  app.store.getState().user_name,
            msg_userimage: app.store.getState().user_image,
            msg_text: _this.data.msg,
            createTime: _this.data.sysTime
          }
          let list = _this.data.msgList
          list.push(sendMsg)
          _this.setData({
            msgList: list,
            msg: ''
          })
        }
      })

      SocketTask.send({
        data: JSON.stringify(this.data.msg)
      }, function (res) {
        console.log('已发送', res)
      })
    }

  },

  getSysTime() {
    let _this = this;
    _this.setData({
      sysTime: ''
    })
    let yy = new Date().getFullYear();
    let mm =
      new Date().getMonth() < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    let dd =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    let hh = new Date().getHours();
    let mf =
      new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes();
    let ss =
      new Date().getSeconds() < 10
        ? "0" + new Date().getSeconds()
        : new Date().getSeconds();
        _this.setData({
          sysTime: yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss
        }) 
  },

  onHide: function () {
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },

});