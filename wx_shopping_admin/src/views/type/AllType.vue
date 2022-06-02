<template>

  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="商品分类管理" />
    <el-button type="primary" @click="dialogFormVisible = true"><i class="el-icon-circle-plus-outline" />添加分类</el-button>
    <el-divider />
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="t_name" label="类型名" />

      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateType(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteType(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑分类" :visible.sync="updateForm">
      <el-form :model="formUpdate">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="formUpdate.updateName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateForm = false">取 消</el-button>
        <el-button type="primary" @click="updateTypeSubmit(beforeName)">确 定</el-button>
      </div>
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
  name: 'AllType',
  data() {
    return {
      dialogFormVisible: false,
      updateForm: false,
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
      form: {
        name: ''
      },
      formUpdate: {
        updateName: '',
        id: ''
      },
      formLabelWidth: '120px',
      beforeName: '',
      commtable: [],
      totalCount1: 1
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    addType() {
      console.log(this.form.name)
      if (this.form.name != '') {
        this.axios.post(
          '/type/addType',
          {
            t_name: this.form.name
          }
        ).then(
          (resp) => {
            if (resp.data == 1) {
              this.$confirm('添加成功')
              this.form.name = ''// 置空
              this.dialogFormVisible = false
              this.load()
            }
          }
        ).catch(
          (resp) => {
            this.$confirm('网络异常！')
          }
        )
      } else {
        this.dialogFormVisible = false
        this.$confirm('内容为空！')
      }
    },

    updateType(row) {
      console.log(row)
      this.formUpdate.updateName = row.t_name
      this.formUpdate.id = row.t_id
      this.updateForm = true
      this.beforeName = this.formUpdate.updateName
    },
    updateComm(beforeName) {
      this.axios.get(
        '/commodity/getCommodityByTypeName',
        {
          params: { commodity_typename: beforeName
          }
        }
      ).then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.updateComm1(res.data[i].commodity_id)
          }
        }
      )
    },
    updateComm1(commodity_id) {
      this.axios.post(
        '/commodity/updateCommodity',
        {
          commodity_id: commodity_id,
          commodity_typename: this.formUpdate.updateName
        }
      ).then(
        //this.$confirm('修改商品类型成功')
      )
    },
    updateTypeSubmit(beforeName) {
      // eslint-disable-next-line eqeqeq
      if (this.formUpdate.updateName==''){
        this.updateForm = false
        this.$confirm('修改内容为空')
      }
      else if (beforeName != this.formUpdate.updateName ) {
        this.axios.post(
          '/type/updateType',
          {
            t_name: this.formUpdate.updateName,
            t_id: this.formUpdate.id
          }
        ).then(
          (resp) => {
            if (resp.data == 1) {
              this.$confirm('修改成功')
              this.updateComm(beforeName)

            }
            // this.formUpdate.updateName = ''// 置空
            this.formUpdate.id = ''
            this.updateForm = false
            this.load()
          }
        ).catch(
          (resp) => {
            this.$confirm('网络异常！')
          }
        )
      } else {
        this.updateForm = false
      }
    },

    deleteType(row) {
      this.axios.get(
        '/commodity/getCommodityByType',
        {
          params: { commodity_typename: row.t_name
          }
        }
      ).then(
        (resp) => {
          // eslint-disable-next-line eqeqeq
          if (resp.data == 0) {
            this.axios.get(
              '/type/deleteType',
              {
                params: { id: row.t_id
                }
              }
            ).then(
              (resp) => {
                this.$confirm('删除成功！')
                this.load()
              }
            ).catch(
              (resp) => {
                this.$confirm('网络异常！')
              }
            )
          } else {
            this.$confirm('存在该分类商品，无法删除')
          }
        }
      )
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
        '/type/getAllType',
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData = resp.data
          console.log(resp.data)
          // 将数据的长度赋值给totalCount

          this.totalCount = resp.data.length
          console.log('length ' + this.totalCount)
        }
      ).catch(
        (resp) => {
          this.$confirm('网络异常！')
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
