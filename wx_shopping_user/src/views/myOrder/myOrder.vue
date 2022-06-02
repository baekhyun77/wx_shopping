<template>
  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="订单管理"  />

    &nbsp;&nbsp;查看方式：
    <el-select v-model="order_status" :value="order_status" aria-label="查看方式" placeholder="查看方式"  @change="searchOrder">
      <el-option
        v-for="(item, index) in statusList"
        :key="item.index"
        :label="item.title"
        :value="item.status"
       >
      </el-option>
    </el-select>
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column v-if="order_status != '0' && order_status != '' && order_status != '9'" prop="order_id" label="订单号" >
      </el-table-column>
      <el-table-column prop="order_commodityname" label="商品名称" >
      </el-table-column>
      <el-table-column label="图片" >
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="mouseOver(scope.row)" >预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="order_username" label="购买人" >
      </el-table-column>
      <el-table-column prop="order_addressconsignee" label="收货人" >
      </el-table-column>
      <el-table-column prop="order_addressphone" label="收货人电话" >
      </el-table-column>
      <el-table-column prop="order_addressname" label="收货地址" >
      </el-table-column>
      <el-table-column prop="order_num" label="购买数量" >
      </el-table-column>
      <el-table-column prop="order_pay" label="支付金额" >
      </el-table-column>
      <el-table-column prop="order_price" label="商品单价" >
      </el-table-column>
      <el-table-column prop="order_purchase" label="购买方式" >
        <template slot-scope="scope">
          <el-tag type="danger" size="small" plain v-if="scope.row.order_purchase == '0'" >直接购买</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_purchase == '1'" >团购</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order_purchase" label="订单状态" >
        <template slot-scope="scope">
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '0'" >在购物车中</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '1'" >待发货</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '2'" >待收货</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '3'" >待评价</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '4'" >已完成</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.order_status == '5'" >退款成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.order_status == '1'" @click="updateOrder(scope.row)">发货</el-button>
          <el-button type="text" size="small" v-if="scope.row.order_status == '2'">等待用户收货</el-button>
          <el-button type="text" size="small" v-if="scope.row.order_status == '3'">等待用户评价</el-button>
          <el-button type="text" size="small" v-if="scope.row.order_status == '4'" @click="showComment(scope.row)">查看评价</el-button>
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
    <!--图片预览-->
    <el-dialog title="预览" width="30%"  :visible.sync="showUserImg">
      <el-image :src="imageUrl" ></el-image>
    </el-dialog>

    <el-dialog title="查看评论" width="50%"  :visible.sync="showCommentTrue">
      <el-timeline  >
        <el-timeline-item  style="margin-left: 50px" v-for="(item, index) in commentList" :key="index" :timestamp="item.createTime" placement="top">
          <el-card style="margin-right: 200px ">
            <div style="display: inline">
              <el-avatar size="medium"  :src="item.comment_userimage"></el-avatar>{{item.comment_username}}
              <h4 style="display: inline; margin-left: 15px; margin-bottom: 15px; font-size: 20px">{{item.comment_content}}</h4>
            </div>
            <p>{{item.comment_stars}}星 &nbsp;&nbsp;&nbsp;{{item.comment_level}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "myOrder",

  data() {
    return {
      order_status: '9',
      statusList: [
        {status:'9', title: '全部订单'},
        {status:'0', title: '用户购物车中'},
        {status:'1', title: '已下单待发货'},
        {status:'2', title: '待收货'},
        {status:'3', title: '待评价'},
        {status:'4', title: '已完成'},
        {status:'5', title: '已退款'},
      ],

      showCommentTrue: false,
      commentList:[],

      shop_id: '',//这个是需要首要初始化的数据
      showUserImg : false,//预览图片
      imageUrl:'',//图片地址
      //添加表单的数据
      tableData: [],
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

    /**
     * 通过订单号查看评论
     * */
    showComment(row) {
      this.axios.get(
        '/comment/queryCommentByOrder',
        {params: {comment_orderid: row.order_id}}
      ).then(
        (res) => {
          this.commentList = res.data;
          this.showCommentTrue = true;
        }
      )
    },

    /**
     * 发货
     **/
    updateOrder(row) {
      this.axios.post(
        '/order/updateOrderStatus',
        {
          order_id: row.order_id,
          order_status: '2' //修改状态为2 。变为已发货待收货
        }
      ).then(
        (res) => {
          this.loadOrder()
          this.$confirm("发货成功！");
        }
      ).catch(
        (res) => {
          console.log(order)
          this.$confirm("网络异常！");
        }
      )
    },

    /**
     * 预览头像
     * @param row
     */
    mouseOver(row) {
      this.showUserImg = true;
      this.imageUrl = ''
      this.imageUrl = row.order_commodityimage
    },

    /**
     * 动态获取
     **/
    searchOrder() {
      if(this.shop_id != '' && this.order_status != '9' && this.order_status != '') {
        this.axios.post(
          '/order/queryOrder',
          {
            "order_shopid": this.shop_id,
            "order_status" : this.order_status
          }
        ).then(
          (res) => {
            this.tableData = res.data;
            this.totalCount = res.data.length
          }
        ).catch(
          (res) => {
            console.log(order)
            this.$confirm("网络异常！");
          }
        )
      }
      if(this.order_status == '9') {
        this.axios.post(
          '/order/queryOrder',
          {
            "order_shopid": this.shop_id,
          }
        ).then(
          (res) => {
            this.tableData = res.data;
            this.totalCount = res.data.length
          }
        ).catch(
          (res) => {
            console.log(order)
            this.$confirm("网络异常！");
          }
        )
      }
    },

    /**
     * 加载初始化信息。也可以通过
     */
    loadOrder() {
      this.axios.get(
        '/shop/getShopByUserId',
        {params: {id: this.$store.state.user.userInfo.user.user_id}}
      ).then(
        (resp) => {
          this.shop_id = resp.data.shop_id; //定义shop_id, 搜索有用。
          this.axios.post(
            '/order/queryOrder',
            {"order_shopid": resp.data.shop_id}
          ).then(
            (res) => {
              this.tableData = res.data;
              this.totalCount = res.data.length
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
  },

  mounted() {
    this.loadOrder();
  },


}
</script>

<style scoped>

</style>
