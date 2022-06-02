// pages/selectGoods/selectGoods.js
const app = getApp();
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
    commodity_shopid:'', //填入订单表中作为店铺id
    commodity_shopname:'',
    commodity_describe:'',
    commodity_group:'',
    commodity_discount:'',
    commodity_group_num: '',
    commodity_sales:'',
    commodity_status:'',
    commodity_time:'',

    //地址相关
    order_addressid:'',
    order_addressconsignee:'',
    order_addressdetails:'',
    order_addressname:'',
    order_addressphone:'',

    order_num: 1,
    order_shopid:'',
    order_pay:'',
    order_price:'',
    order_purchase:'',
    order_status:'',

    // 验证店铺id与商品店铺id是否相同
    shop_id:'',

    //获取密码
    user_payword:'',

    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点

    flag:'',
   
  },

   /**
   * 显示支付密码输入层
   */
  showInputLayer: function(){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function(){
    var val = this.data.pwdVal;
    this.getPayword()
    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' });
    if(val == this.data.user_payword){
      this.data.flag=true
      let order = {
        order_commodityid : this.data.commodity_id,
        order_commodityimage : this.data.commodity_image,
        order_commodityname : this.data.commodity_name,
        order_commoditystatus : this.data.commodity_status,
        order_userid : app.store.getState().user_id,//，跨页通讯和数据传递
        order_username : app.store.getState().user_name, //购买人的真实姓名
        order_addressid : this.data.order_addressid,
        order_addressconsignee : this.data.order_addressconsignee, //收货人
        order_addressdetails : this.data.order_addressdetails,
        order_addressname : this.data.order_addressname, //收货地址
        order_addressphone : this.data.order_addressphone, //收货人的电话
        order_num : this.data.order_num, //购买数量
        order_shopid : this.data.commodity_shopid, //店铺id
        order_pay : this.data.order_pay, //支付的金额，团购或者直接购买的金额不同
        order_price : this.data.commodity_price, // 商品的原有价格、
        order_purchase : this.data.order_purchase, //购买方式 1团购，0直接购买
        order_status : "1", //添加购物车，或者直接购买，即status=="1" 状态 0：购物车；1：下单； 2 ：发货； 3；收货完成； 4退货 售后； 5 异常
      }
        wx.request({
          url: app.globalData.baseUrl + '/order/addCart',
          method:"POST",
          data: order,
          success(res) {
            wx.showToast({
              title: '支付成功',
              icon:'none'
            })
            console.log("success!!!")
          },
          fail(res) {
              wx.showToast({
                title: '网络异常',
                icon:'none'
              })
          }
        })
      }
    else{
      this.data.flag=false
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }
 
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e){
      this.setData({ pwdVal: e.detail.value });
 
      if (e.detail.value.length >= 6){
        this.hidePayLayer();
      }
  },

  RestPwd(){
  
    wx.request({
      url: app.globalData.baseUrl + '/user/updateUserInfo',
      method:"POST",
      data:{
        user_id: app.store.getState().user_id,
        user_payword:"000000",
      },
      success(res) {
        wx.showToast({
          title: '密码重置为000000',
          icon:'none'
        })
      },
    })

  },

  getPayword(){
    const _this = this
    wx.request({
      url: app.globalData.baseUrl + '/user/getUserInfo',
      data: {id : app.store.getState().user_id},
      success(res) {
        console.log(res.data.user_payword);
        _this.setData({
          user_payword : res.data.user_payword
        })
      },
    })
    console.log("############")
    console.log(_this.data.user_payword)
    console.log("############")

  },

  /**
   * 提交 
   */
  submit() {
    if(this.data.order_num >= this.data.commodity_group_num && this.data.commodity_group == "1") {
      console.log((this.data.commodity_price * this.data.commodity_discount * 0.1 * this.data.order_num).toFixed(2));//order_price 保留两位小数 返回string
      this.data.order_pay = (this.data.commodity_price * this.data.commodity_discount * 0.1 * this.data.order_num).toFixed(2);//支付金额
      this.data.order_purchase = "1" //购买方式为团购
    }
    else{
      this.data.order_pay = (this.data.commodity_price * this.data.order_num).toFixed(2);//支付金额
      this.data.order_purchase = "0" //直接购买
    }
    if(this.data.order_addressid == "" || this.data.order_addressconsignee == "") {
      wx.showToast({
        title: "请先选择收货地址",
        icon: 'none',
      })
      return
    }
     this.showInputLayer()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      commodity_id : options.commodity_id,
  });
  this.getPayword()
  console.log(this.data.user_payword)
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
   
    let _this = this;
    wx.request({
      url:  app.globalData.baseUrl + '/commodity/adminGetCommodity',
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

  //个数选择器
  minusCount(e) {
    let order_num = this.data.order_num;
    order_num--;
    if (order_num < 1) {
      return;
    }
    this.setData({
      order_num
    });
    // wx.setStorageSync('select_num', select_num);
  },
  addCount(e) {
    let order_num = this.data.order_num;
    order_num++;
    if (order_num > this.data.commodity_num) { //大于库存
      return;
    }
    this.setData({
      order_num
    });
    // wx.setStorageSync('select_num', select_num);
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