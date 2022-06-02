<template>

  <div>
    <p v-for="message in msgList" >{{message}}</p>
    发送人：<el-input v-model="fromUserId"></el-input>
    发送人：<el-input v-model="toUserId"></el-input>
    <el-button @click="init">连接</el-button>

    消息：<el-input v-model="msg"></el-input>

    <el-button @click="send">test</el-button>
  </div>
</template>

<script>
export default {
  name: "TestWebSocket",

  data() {
    return {
      username: '',
      msg: '',
      msgList: [],
      fromUserId: '',
      toUserId: '',
    }
  },

  mounted () {
    // 初始化
    // this.init()
  },
  methods: {
    init: function () {
      if(typeof(WebSocket) === "undefined"){
        alert("您的浏览器不支持socket")
      }else{
        // 实例化socket
        this.socket = new WebSocket( "ws://127.0.0.1:8083/ws/" + this.fromUserId + "/" + this.toUserId)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error

        this.socket.onmessage = this.getMessage
      }
    },

    open: function () {
      console.log("socket连接成功")
    },

    error: function () {
      console.log("连接错误")
    },

    getMessage: function (msg) {
      console.log(msg.data)
    },

    send: function () {
      this.socket.send(this.msg)
    },


    close: function () {
      console.log("socket已经关闭")
    }
  },
  destroyed () {
    // 销毁监听
    this.socket.onclose = this.close
  }
}
</script>

<style scoped>

</style>
