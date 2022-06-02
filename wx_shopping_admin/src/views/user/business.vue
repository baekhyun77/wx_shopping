<template>

  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="商家审核" />
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="join_userid" label="用户id" />
      <el-table-column prop="join_username" label="真实姓名" />
      <el-table-column prop="join_reason" label="理由" />
      <el-table-column prop="createTime" label="申请时间" />

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.join_status == '1'" type="success" size="small" plain>启用</el-tag>
          <el-tag v-if="scope.row.join_status == '0'" type="danger" size="small" plain>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.join_status == '1'" type="text" size="small" @click="updateUserRootId2(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.join_status == '0'" type="text" size="small" @click="updateUserRootId3(scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="预览" width="30%" :visible.sync="showUserImg">
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
import { validatePhone } from '@/utils/validator'

export default {
  name: 'ShopType',
  data() {
    return {
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
      formLabelWidth: '120px',
      imageUrl: '',
      shop_id: '',

      addUserDialog: false// 打开添加用户表单

    }
  },

  mounted() {
    this.load()
  },

  methods: {
    /**
     * 在微信小程序中，为data复制，必须获取Page的对象，（回调函数有自己的this对象！！！），然后setData方法赋值
     * @param row
     */
    /**
     * 预览头像
     * @param row
     */
    mouseOver(row) {
      this.showUserImg = true
      this.imageUrl = ''
      this.imageUrl = row.user_image
    },

    /**
     * 提升权限
     **/
    async updateUserRootId2(row) {
      this.$confirm('不可进行此项操作')
      /*
      this.axios.post(
        '/join/updateJoin',
        {
          join_id: row.join_id,
          join_userid: row.join_userid,
          join_status: '0',
          join_username: row.join_username
        }
      ).then(
        (resp) => {
          this.load()
          this.$confirm('修改成功')
        }
      )
      await this.FindShop(row)*/
    },
    async FindShop(row) {
      this.axios.get(
        'shop/getShopByUserId',
        { params: { id: row.join_userid }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData1 = resp.data
          // eslint-disable-next-line no-undef

          // eslint-disable-next-line no-undef
          this.shop_id = resp.data.shop_id
          this.axios.post(
            'shop/updateShop',
            {
              // eslint-disable-next-line no-undef
              shop_id: this.shop_id,
              shop_status: 'false'
            }
          ).then(
            (resp) => {
            //  this.$confirm('修改店铺禁用成功')
            }
          )
        })
      await this.FindComm(row)
    },
    async FindComm(row) {
      this.axios.get(
        'commodity/getCommodityByUserId',
        { params: { id: row.join_userid }}
      ).then(
        (resp) => {
          this.tableData2 = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount1 = resp.data.length
          for (let i = 0 ; i < this.totalCount1; i++) {
            this.axios.post(
              'commodity/updateCommodity',
              {
                commodity_id: this.tableData2[i].commodity_id,
                commodity_status: '0'
              }
            ).then(
              (resp) => {
              //  this.$confirm('修改商品下架成功')
              }
            )
          }
        })
    },
    /**
     * 降低权限
     **/
    async updateUserRootId3(row) {
      this.axios.post(
        '/join/updateJoin',
        { join_id: row.join_id, join_userid: row.join_userid, join_status: '1',
          join_username: row.join_username
        }
      ).then(
        (resp) => {
          this.load()
          this.$confirm('修改成功')
        }
      )
      await this.FindShop1(row)
    },
    async FindShop1(row) {
      this.axios.get(
        'shop/getShopByUserId',
        { params: { id: row.join_userid }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData1 = resp.data
          // eslint-disable-next-line no-undef
          this.shop_id = resp.data.shop_id
          this.axios.post(
            'shop/updateShop',
            {
              shop_id: this.shop_id,
              shop_status: 'true' }
          ).then(
            (resp) => {
            //  this.$confirm('修改店铺启用成功')
            }
          )
        }
      )
      await this.FindComm1(row)
    },
    async FindComm1(row) {
      this.axios.get(
        'commodity/getCommodityByUserId',
        { params: { id: row.join_userid }}
      ).then(
        (resp) => {
          this.tableData2 = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount1 = resp.data.length
          for (let i = 0 ; i < this.totalCount1; i++) {
            this.axios.post(
              'commodity/updateCommodity',
              {
                commodity_id: this.tableData2[i].commodity_id,
                commodity_status: '1'
              }
            ).then(
              (resp) => {
               // this.$confirm('修改商品上架成功')
              }
            )
          }
        })
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
        '/join/getAllJoin',
        {
          params: { id: this.$store.state.user.userInfo.user.u_family_id }
        }
      ).then(
        (resp) => {
          this.tableData = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount = resp.data.length
        }
      ).catch(
        (resp) => {
          this.$confirm('网络异常！')
        }
      )
    },

    /**
     * 头像上传方法，上传之后将数据填充到具体字段，上传成功之后的回调函数。控件直接绑定了url
     * @param res
     * @param file
     */
    handleAvatarSuccess(res, file) {
      this.form.u_image = this.axios.defaults.baseURL + '/' + res[0]
    },
    beforeAvatarUpload(file) {
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
