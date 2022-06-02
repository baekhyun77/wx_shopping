<template>
  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="个人商品"  />

    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="chat_from_username" label="接待人" >
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openTheChat(scope.row)">接待</el-button>
          <el-button type="text" size="small" @click="deleteChat(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      style="align-content: center; align-items: center"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :total="totalCount"
      :page-size="PageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-dialog title="聊天" :visible.sync="openChat" @close="closeChat">
      <JwChat-index  :config="config" :taleList="taleList" @enter="bindEnter" v-model="inputMsg" :toolConfig="toolConfig" />
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "chat",

  data() {
    return {
      openChat: false,
      taleList:[],//聊天的内容
      inputMsg:'',//发送的内容。

      chat_id: '',//这个用于保存到msg表中的字段
      getTime:'',//发消息时候的系统时间
      config:{
        img: '', // 头像
        name: '',
        dept: '', // 下边文字
      },

      toolConfig: {
        // file img video 现在只配置了三个图标
        show: ['file'],
      },

      //这里是连接的信息
      tableData: [],
      // 默认显示第几页
      currentPage:1,
      // 个数选择器（可修改）
      pageSizes:[1,2,3,4,5,6,7,8,9,10],
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount:1,
      // 个数选择器（可修改）
      PageSize:10,
    }
  },

  methods: {

    deleteChat(row) {
      this.axios.get(
        '/chat/deleteChatById',
        {
          params: {id : row.chat_id}
        }
      )
      .then(
        (resp) => {
          this.loadChatList();
        }
      )
    },

    //发送事件
    bindEnter() {
      if(this.inputMsg != '') {
        /**
         * 需要将消息保存到历史记录表中
         */
        this.axios.post(
          '/msg/addMsg',
          {
            msg_chatid : this.chat_id,
            msg_userid : this.$store.state.user.userInfo.user.user_id,
            msg_username : this.$store.state.user.userInfo.user.user_name,
            msg_userimage : this.$store.state.user.userInfo.user.user_image,
            msg_text: this.inputMsg
          }
        )

        /**
         * 需要将发送的消息保存到消息记录表中
         */
        this.getSysTime();//初始化诗句
        let msg = {
          "date": this.getTime,
          "text": { "text": this.inputMsg },
          "mine": true,
          "name": this.$store.state.user.userInfo.user.user_name,
          "img": this.$store.state.user.userInfo.user.user_image
        };
        this.taleList.push(msg);

        this.send(this.inputMsg);
      }
      this.inputMsg = ''
    },

    //弹框关闭事件
    closeChat() {
      this.socket.close();
    },

    /**
     * 打开聊天框
     * @param row
     */
    openTheChat(row) {
      //初始化chat_id
      this.chat_id = '';
      this.chat_id = row.chat_id;

      //初始化聊天框信息。
      this.config.dept = '';
      this.config.img = '';
      this.config.name = '';
      this.config.dept = row.createTime;
      this.config.name = row.chat_from_username;
      this.config.img = row.chat_from_userimage;

      //初始化历史消息。
      this.taleList = []
      this.axios.get(
        '/msg/getMsgByChat',
        {params: {id: row.chat_id}}
      ).then(
        (resp) => {
          let msg = {
            "date": "",
            "text": { "text": "" },
            "mine": false,
            "name": "",
            "img": ""
          };
          for(let i = 0; i < resp.data.length; i ++ ) {
            msg = {
              "date": "",
              "text": { "text": "" },
              "mine": false,
              "name": "",
              "img": ""
            };
            msg.date = resp.data[i].createTime;
            msg.text.text = resp.data[i].msg_text;
            if(resp.data[i].msg_userid == row.chat_from_userid) { //由买家发的消息。
              msg.mine = false;
              msg.name = row.chat_from_username;
              msg.img = row.chat_from_userimage;
            }
            else { //该条消息由商家发出。也就是自己
              msg.mine = true;
              msg.name = this.$store.state.user.userInfo.user.user_name;
              msg.img = this.$store.state.user.userInfo.user.user_image;
            }
            this.taleList.push(msg);
          }
        }
      ).catch(
        (resp) => {
          this.$confirm("初始化历史消息失败！");
        }
      )

      this.openChat = true;
      //初始化连接信息
      if(typeof(WebSocket) === "undefined"){
        alert("您的浏览器不支持socket")
      }else{
        // 实例化socket
        this.socket = new WebSocket( "ws://127.0.0.1:8083/ws/" + row.chat_to_userid + "/" + row.chat_from_userid)//这里从表格中间获取的话，直接换一下。
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
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
      /**
       * 将收到的消息保存到显示框中去。
       */
      let pushMsg = msg.data.replace('"','').replace('"',''); //去掉前后的引号
      this.getSysTime();//初始化诗句
      let msg1 = {
        "date": this.getTime,
        "text": { "text": pushMsg },
        "mine": false,
        "name": this.config.name,
        "img": this.config.img,
      };
      this.taleList.push(msg1);

      console.log(msg.data)
    },

    send: function (msg) {
      this.socket.send(msg)
    },

    close: function () {

      console.log("socket已经关闭")
    },


    //获取所有连接的信息。
    loadChatList() {
      this.axios.post(
        '/chat/selectChat',
        {chat_to_userid: this.$store.state.user.userInfo.user.user_id} // 所有的商家的都是被动的连接，所以，商家的id只查询一下toUserId即可。
      ).then(
        (resp) => {
          this.tableData = resp.data;
          this.totalCount = resp.data.length
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },

    // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize=val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage=1
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage=val
    },

    getSysTime: function () {
      this.getTime = '';
      let _this = this;
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
      _this.getTime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },
  },

  mounted() {
    this.loadChatList();
  }
}
</script>

<style scoped>

</style>
