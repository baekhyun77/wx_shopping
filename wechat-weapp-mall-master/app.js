//app.js

//挂载wxministore
// import store from './store/index'
const Store = require("./store/store")
let store = new Store({
  state: {
    msg: "",
    user_name: '',
    user_id: '', 
    user_show: '',
    user_image: '',
    user_address: '',
    user_phone: '',
    user_email: '',
    user_status: '',
    user_rootid: '',
    user_payword:'',
  },
}) 
App({
  store : store,
  onLaunch: function () {
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData:{
    userInfo:null,
    baseUrl: "http://localhost:8083"
  }
})