<template>

  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="用户列表" />
    &nbsp;查看方式：
    <el-select v-model="userstatus" :value="userstatus" aria-label="查看方式" placeholder="查看方式" @change="searchOrder">
      <el-option
        v-for="(item, index) in statusList"
        :key="item.index"
        :label="item.title"
        :value="item.status"
      />
    </el-select>

    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="user_name" label="真实姓名" />
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="mouseOver(scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="user_phone" label="手机号" />
      <el-table-column prop="user_show" label="昵称" />
      <el-table-column prop="user_root_id" label="用户身份">
        <template scope="scope">
          <p v-if="scope.row.user_rootid=='3'">普通用户</p>
          <p v-if="scope.row.user_rootid=='2'">商家</p>
          <p v-if="scope.row.user_rootid=='1'">超级管理员</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="user_email" label="邮箱" />
      <el-table-column prop="user_address" label="地址" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.user_status == '1'" type="success" size="small" plain>启用</el-tag>
          <el-tag v-if="scope.row.user_status == '0'" type="danger" size="small" plain>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.user_status == '1'" type="text" size="small" @click="updateUserRootId2(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.user_status == '0'" type="text" size="small" @click="updateUserRootId3(scope.row)">启用</el-button>
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

    </el-select></div>
</template>

<script>
import { validatePhone } from '@/utils/validator'

export default {
  name: 'ShopType',
  data() {
    return {
      userstatus: '0',
      statusList: [
        { status: '0', title: '全部用户' },
        { status: '1', title: '管理员' },
        { status: '2', title: '商家' },
        { status: '3', title: '普通用户' }
      ],

      showUserImg: false,
      // 添加表单的数据
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
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
      join_id: '',
      totalCount1: 1,

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
     * 动态获取
     **/
    searchOrder() {
      // eslint-disable-next-line eqeqeq
      if(this.userstatus == '0'){
        this.load()
        // eslint-disable-next-line eqeqeq
      } else if (this.user_status != '') {
        this.axios.get(
          '/user/getUserByRootId',
          {
            params: { id: this.userstatus }
          }
        ).then(
          (res) => {
            this.tableData = res.data
            this.totalCount = res.data.length
          }
        ).catch(
          (res) => {
            this.$confirm('网络异常！')
          }
        )
      }
    },

    /**
     * 提升权限
     **/
    async updateUserRootId2(row) {
      this.shop_id = ''
      this.axios.post(
        'user/updateUserInfo',
        {
          user_id: row.user_id,
          user_status: '0'
        }
      ).then(
        (resp) => {
          this.load()
          this.$confirm('禁用成功')
        },
      )
      await this.FindShop(row)
    },
    async FindShop(row) {
      this.axios.get(
        'shop/getShopByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData1 = resp.data
          this.shop_id = resp.data.shop_id
          this.axios.post(
            'shop/updateShop',
            {
              shop_id: this.shop_id,
              shop_status: 'false'
            }
          ).then(
            (resp) => {
              // this.$confirm('修改店铺禁用成功')
            }
          )
        })
      await this.FindComm(row)
    },
    async FindComm(row) {
      this.axios.get(
        'commodity/getCommodityByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          this.tableData2 = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount1 = resp.data.length
          for (let i = 0; i < this.totalCount1; i++) {
            this.axios.post(
              'commodity/updateCommodity',
              {
                commodity_id: this.tableData2[i].commodity_id,
                commodity_status: '0'
              }
            ).then(
              (resp) => {
                // this.$confirm('修改商品下架成功')
              }
            )
          }
        })
      await this.FindJoin(row)
    },
    async FindJoin(row) {
      this.axios.get(
        'join/getAllJoinByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData3 = resp.data
          this.join_id = resp.data.join_id
          this.axios.post(
            'join/updateJoin',
            {
              join_id: this.join_id,
              join_status: '0'
            }
          ).then(
            (resp) => {
              // this.$confirm('修改join店铺禁用成功')
            }
          )
        })
    },

    /**
     * 降低权限
     **/
    async updateUserRootId3(row) {
      this.axios.post(
        'user/updateUserInfo',
        { user_id: row.user_id, user_status: '1' }
      ).then(
        (resp) => {
          this.load()
          this.$confirm('启动成功')
        })
      await this.FindShop1(row)
    },
    async FindShop1(row) {
      this.axios.get(
        'shop/getShopByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData1 = resp.data
          this.shop_id = resp.data.shop_id
          this.axios.post(
            'shop/updateShop',
            {
              shop_id: this.shop_id,
              shop_status: 'true' }
          ).then(
            (resp) => {
              // this.$confirm('修改店铺启用成功')
            }
          )
        }
      )
      await this.FindComm1(row)
    },
    async FindComm1(row) {
      this.axios.get(
        'commodity/getCommodityByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          this.tableData2 = resp.data
          // 将数据的长度赋值给totalCount
          this.totalCount1 = resp.data.length
          for (let i = 0; i < this.totalCount1; i++) {
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
      await this.FindJoin1(row)
    },
    async FindJoin1(row) {
      this.axios.get(
        'join/getAllJoinByUserId',
        { params: { id: row.user_id }}
      ).then(
        (resp) => {
          console.log(resp.data.length)
          this.tableData3 = resp.data
          this.join_id = resp.data.join_id
          this.axios.post(
            'join/updateJoin1',
            {
              // eslint-disable-next-line no-undef
              join_id: this.join_id,
              join_status: '1'
            }
          ).then(
            (resp) => {
            //  this.$confirm('修改join店铺启用成功')
            }
          )
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
        '/user/getAllUser',
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
