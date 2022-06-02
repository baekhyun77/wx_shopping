
<template>
  <div class="mixin-components-container">

    <p style="margin-top: 10px; margin-bottom: 20px; font-size: 30px; color: #5a5e66">商家管理系统欢迎您:{{userName}}</p>



    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #5a5e66">营业额：</span>
          </div>
          <div class="component-item">
              <p style="font-size:25px; font-style: oblique; color: #409EFF">{{turnOver}}<i style="font-size: 25px; color: red">￥</i></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #5a5e66">订单数量：</span>
          </div>
          <div class="component-item">
            <p style="font-size:25px; font-style: oblique; color: #409EFF">{{orderNum}}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #5a5e66">待处理：</span>
          </div>
          <div class="component-item">
            <p style="font-size:25px; font-style: oblique; color: #409EFF">{{pending}}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #5a5e66">已完成：</span>
          </div>
          <div class="component-item">
            <p style="font-size:25px; font-style: oblique; color: #409EFF">{{alreadyOrder}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div>
    <div id="orderStatus" style="width: 600px;height:400px; margin-top: 100px; float: left"></div>
    <div id="eCharts" :style="'width: ' + widthPx +'px;height:400px; margin-top: 100px; float: left '"></div>
    <div id="FindtypeNum" :style="'width: ' + widthPx +'px;height:400px; margin-top: 100px; float: left '"></div>

    </div>
<!--    <el-col :span="6"   margin:0 auto;>-->
<!--      <el-card class="box-card">-->
<!--        <div slot="header" class="clearfix">-->
<!--          <span style="color: #5a5e66">已完成：</span>-->
<!--        </div>-->
<!--        <div class="component-item">-->
<!--          <p style="font-size:25px; font-style: oblique; color: #409EFF">{{alreadyOrder}}<i style="font-size: 25px; color: red">￥</i></p>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-col>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const echarts = require('echarts');
export default {
  name: 'Dashboard',
  data() {
    return {
      userName: '', //用户名
      turnOver: '', //营业额
      orderNum: 0, //状态不 为0
      pending: 0, //状态为1
      alreadyOrder: 0, //状态为4
      cla: '',
      widthPx: 900,

    }
  },

  mounted() {
    this.userName = this.$store.state.user.userInfo.user.user_name;
    this.loadTurnover();
    this.loadCommoditySale()

  },

  methods: {


    loadTurnover() {
      this.axios.get(
        '/shop/getShopByUserId',
        {params: {id: this.$store.state.user.userInfo.user.user_id}}
      ).then(
        (resp) => {
          this.turnOver = resp.data.shop_turnover; //营业额
          this.shop_id = resp.data.shop_id; //定义shop_id, 搜索有用。
          this.axios.post(
            '/order/queryOrder',
            {
              "order_shopid": resp.data.shop_id
            }
          ).then(
            (res) => {
              let gouwuche = 0;
              let daishouhuo = 0;
              let tuikuan = 0;
              let daipingjia = 0;
              for(let i = 0; i < res.data.length; i ++ ) {
                if(res.data[i].order_status == '0') {
                  gouwuche += 1;
                }
                if(res.data[i].order_status == '2') {
                  daishouhuo += 1;
                }
                if(res.data[i].order_status == '5') {
                  tuikuan += 1;
                }
                if(res.data[i].order_status == '3') {
                  daipingjia += 1;
                }
                if(res.data[i].order_status != '0') {
                  this.orderNum += 1;
                }
                if(res.data[i].order_status == '1') {
                  this.pending += 1;
                }
                if(res.data[i].order_status == '4') {
                  this.alreadyOrder += 1
                }
              }

              //初始化表格数据
              let myChart = echarts.init(document.getElementById('orderStatus'));
// 绘制图表
              myChart.setOption({
                title: {
                  text: '订单状态图'
                },
                tooltip: {},
                xAxis: {
                  data: ['购物车中', '待发货', '待收货', '待评价', '已完成', '退款']
                },
                yAxis: {},
                series: [{
                  name: '订单数',
                  type: 'bar',
                  data: [gouwuche, this.pending, daishouhuo, daipingjia, this.alreadyOrder, tuikuan]
                }]
              });

            }
          ).catch(
            (res) => {
              console.log(order)
              this.$confirm("网络异常！");
            }
          )
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },

    /**
     * 加载商品的销售额
     */
    loadCommoditySale() {
      this.axios.get(
        '/order/loadCommoditySale',
        { params: {userId : this.$store.state.user.userInfo.user.user_id}}
      ).then(
        (resp) => {
          this.widthPx = resp.data.length * 150
          //初始化表格数据
          let myChart = echarts.init(document.getElementById('eCharts'));
          let name = [];
          let sale = [];
          let tishi = [];
          for(let i = 0; i < resp.data.length; i ++) {
            // console.log(resp.data[i].commodityName.length)
            let n
            if(resp.data[i].commodityName.length > 10) {
              n = resp.data[i].commodityName.substr(0, 10);
              n += '...'
            }
            tishi[tishi.length] = n; //下标不越界？
            name[name.length] = resp.data[i].commodityName
            sale[sale.length] = resp.data[i].sale;
          }
// 绘制图表
          myChart.setOption({
            title: {
              text: '销量图'
            },
            tooltip: {},
            xAxis: {
              data: name,

            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'line',
              data: sale
            }]
          });
        }
      )
    },

    },


}
</script>

<style lang="scss" scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>
