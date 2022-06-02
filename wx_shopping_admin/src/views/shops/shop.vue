<template>

  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="店铺列表" />
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="shop_name" label="店铺名称" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="mouseOver(scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shop_describe" label="店铺描述" />
      <el-table-column prop="shop_turnover" label="营业额" />
      <el-table-column prop="shop_username" label="店主名称" />
      <el-table-column prop="shop_visits" label="点击量" />
      <el-table-column prop="shop_address" label="地址" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.shop_status === 'true'" type="success" size="small" plain>上架中</el-tag>
          <el-tag v-if="scope.row.shop_status == 'false'" type="danger" size="small" plain>下架中</el-tag>
        </template>>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="findComm(scope.row)">数据查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="商品数据" :visible.sync="shopcomm">
      <el-table :data="tableData1.slice((currentPage-1)*PageSize,currentPage*PageSize)">
        <el-table-column prop="commodity_name" label="商品名称" />
        <el-table-column prop="commodity_price" label="价格" />
        <el-table-column prop="commodity_typename" label="类型" />
        <el-table-column prop="commodity_num" label="库存" />
        <el-table-column prop="commodity_describe" label="描述" />
        <el-table-column prop="commodity_sales" label="销量" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.commodity_status == '1'" type="success" size="small" plain>已上架</el-tag>
            <el-tag v-if="scope.row.commodity_status == '0'" type="danger" size="small" plain>已下架</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog title="预览" width="30%" :visible.sync="showShopImg">
      <el-image :src="imageUrl" />
    </el-dialog>

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
    />

  </div>
</template>

<script>
export default {
  name: 'Shop',
  data() {
    return {
      dialogFormVisible: false,
      showShopImg: false,
      // 添加表单的数据
      tableData: [],
      tableData1: [],
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      PageSize: 10,
      formLabelWidth: '120px',
      imageUrl: '',
      shop_id: '',
      shopcomm: false,
      addUShopDialog: false// 打开添加用户表单

    }
  },
  mounted() {
    this.load()
  },
  methods: {
    mouseOver(row) {
      this.showShopImg = true
      this.imageUrl = ''
      this.imageUrl = row.shop_image
    },
    // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val
    },
    load() {
      this.axios.get(
        '/shop/getAllShop',
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData = resp.data
          console.log(resp.data)

          this.totalCount = resp.data.length
          console.log('length ' + this.totalCount)
        }
      ).catch(
        (resp) => {
          // this.$confirm('网络异常！')
        }
      )
    },
    // getCommodityByShopId
    findComm(row) {
      this.shopcomm = true
      this.shop_id = ''
      this.shop_id = row.shopId
      this.axios.get(
        '/commodity/getCommodityByShopId',
        { params: { id: row.shop_id }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData1 = resp.data
          console.log(resp.data)
          this.widthPx = resp.data.length * 150
        }
      ).catch(
        (resp) => {
          this.$confirm('网络异常！')
        })
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
