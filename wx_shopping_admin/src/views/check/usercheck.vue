<template>
  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="店铺列表" />
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="notice_user_name" label="用户" />
      <el-table-column prop="notice_message" label="反馈与帮助" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.notice_status =='1'" type="success" size="small" plain>已查看</el-tag>
          <el-tag v-if="scope.row.notice_status == '0'" type="danger" size="small" plain>未查看</el-tag>
        </template>>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="ConfirmLook(scope.row)">确认查看</el-button>
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
    />
  </div>

</template>

<script>
export default {
  name: 'Usercheck',
  data() {
    return {
      dialogFormVisible: false,
      // 添加表单的数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      PageSize: 10,
      formLabelWidth: '120px',
      imageUrl: ''
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
    load() {
      this.axios.get(
        '/notice/getAllNotice',
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
          this.$confirm('网络异常！')
        }
      )
    },
    ConfirmLook(row) {
      if (row.notice_status == '1') {
        return false
      }
      this.axios.post(
        'notice/updateNotice',
        {
          notice_id: row.notice_id,
          notice_status: '1'
        }
      ).then(
        (resp) => {
          this.load()
          this.$confirm('修改成功')
        },
      )
    }
  }
}

</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>
