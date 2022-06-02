<template>
  <div class="mixin-components-container">

    <p style="margin-top: 10px; margin-bottom: 20px; font-size: 30px; color: #5a5e66">管理系统欢迎您</p>

    <el-alert style="background-color: #409EFF; color: #5a5e66; font-style: unset; font-size: 30px" :closable="false" title="经营总览：" />
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="commodity_name" label="商品名称" />
      <el-table-column label="封面">
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="mouseOver(scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_price" label="价格" />
      <el-table-column prop="commodity_typename" label="类型" />
      <el-table-column prop="commodity_num" label="库存" />
      <el-table-column prop="commodity_describe" label="描述" />
      <el-table-column prop="user_root_id" label="团购">
        <template scope="scope">
          <el-tag v-if="scope.row.commodity_group=='1'" type="success" size="small" plain>已开启</el-tag>
          <el-tag v-if="scope.row.commodity_group=='0'" type="danger" size="small" plain>已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_discount" label="团购折扣" />
      <el-table-column prop="commodity_sales" label="销量" />
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <el-tag type="success" size="small" plain v-if="scope.row.commodity_status == '1'" >已上架</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.commodity_status == '0'" >已下架</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="预览" width="30%" :visible.sync="showUserImg">
      <el-image :src="imageUrl" />
    </el-dialog>
    <!--<div id="eCharts" :style="'width: ' + widthPx +'px;height:400px; margin-top: 100px; float: left '" />-->
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
  name: 'Index',
  data() {
    return {
      imageUrl: '', // 预览图像的地址
      showUserImg: false,
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      PageSize: 10,
      cla: '',

    }
  },

  mounted() {
    this.load()
  },

  methods: {

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
    // 预览
    /**
     * 预览头像
     * @param row
     */
    mouseOver(row) {
      this.showUserImg = true
      this.imageUrl = ''
      this.imageUrl = row.commodity_image
    },
    /**
     * 获取商品信息
     */
    load() {
      this.axios.get(
        '/commodity/getAllCommodity',
      ).then(
        (resp) => {
          this.tableData = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount = resp.data.length
        })
    }
  }
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
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>

