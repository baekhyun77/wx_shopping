<template>
  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="我的店铺"  />

    <el-form style="margin-left: 200px; margin-right: 200px" ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="店铺封面" prop="shop_image">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="u_url"
          v-if="editTure == false" disabled
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.shop_image" :src="form.shop_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="u_url"
          v-else
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.shop_image" :src="form.shop_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="店铺名" prop="shop_name">
        <el-input v-if="editTure == false" :disabled="true" v-model="form.shop_name"></el-input>
        <el-input v-else  v-model="form.shop_name"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="shop_phone">
        <el-input v-if="editTure == false" :disabled="true" v-model="form.shop_phone"></el-input>
        <el-input v-else v-model="form.shop_phone"></el-input>
      </el-form-item>
      <el-form-item label="店铺地址" prop="shop_address">
        <el-input v-if="editTure == false" :disabled="true" v-model="form.shop_address"></el-input>
        <el-input v-else v-model="form.shop_address"></el-input>
      </el-form-item>
      <el-form-item label="店铺简介" prop="shop_describe">
        <el-input v-if="editTure == false" :disabled="true" v-model="form.shop_describe"></el-input>
        <el-input v-else v-model="form.shop_describe"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="店铺上下架">
        <el-switch v-if="editTure == false" disabled v-model="form.shop_status"></el-switch>
        <el-switch v-else  v-model="form.shop_status"></el-switch>
      </el-form-item>-->
      <el-form-item label="创建时间">
        <span>{{form.createTime}}</span>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editTure == false" type="primary" @click="editTure = true">修改</el-button>
        <el-button v-else plain disabled type="primary">修改</el-button>

        <el-button v-if="editTure" type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button v-else plain disabled type="primary" @click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import validator, {validatePhone} from '../../utils/validator'
export default {
  name: "shop",
  data() {
    return {
      editTure: false, //编辑菜单
      u_url: 'http://127.0.0.1:8083/imgUpload',
      tableData2:[],
      totalCount1:1,
      form : {
        shop_id : '',
        shop_name : '',
        shop_image : '',
        shop_describe : '',
        shop_turnover : '',
        shop_userid : '',
        shop_username : '',
        shop_visits : '',
        shop_address : '',
        shop_phone : '',
        shop_status : '',
        createTime : '',
      },
      rules:{
        shop_image: [{required:true,message:'店铺封面不能为空',trigger:'blur'}],
        shop_address: [{required:true,message:'店铺地址不能为空',trigger:'blur'}],
        shop_name: [{required:true,message:'店铺名称不能为空',trigger:'blur'}],
        shop_phone:[{required:true,message:'店铺电话不能为空',trigger:'blur'}, {validator : validatePhone, message:'电话输入不合法', trigger: 'blur'}],
        shop_describe:[{required:true,message:'店铺简介不能为空',trigger:'blur'}]
      }
    }
  },

  methods: {

    updateComm(){
      this.axios.get(
        '/commodity/getCommodityByUserId',
        {
          params: {id : this.$store.state.user.userInfo.user.user_id}
        }
      ).then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.updateComm1(res.data[i].commodity_id)
          }
        }
      )
    },
    updateComm1(commodity_id){
      this.axios.post(
        '/commodity/updateCommodity',
        {
          commodity_id: commodity_id,
          commodity_shopname: this.form.shop_name
        }
      ).then(
       // this.$confirm('修改商品店铺成功')
      )
    },

    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.axios.post(
            '/shop/updateShop',
            {
              shop_id: this.form.shop_id,
              shop_name : this.form.shop_name,
              shop_image : this.form.shop_image,
              shop_describe : this.form.shop_describe,
              shop_userid: this.$store.state.user.userInfo.user.user_id,
              shop_username: this.$store.state.user.userInfo.user.user_name,
              shop_address : this.form.shop_address,
              shop_phone : this.form.shop_phone,
              shop_status : this.form.shop_status,
            }
          ).then(

            (info) => {
              this.updateComm()
              if(info.data == "1") {
                this.$confirm("修改成功！");
                this.editTure = false
              }
              else {
                this.$confirm("注册失败！");
              }

            }
          ).catch(  //请求成功 确进入这个方法，说明，then方法有问题
            (failResponse) => {
              this.$confirm("网络异常！");
            }
          )
        }
        else {
          this.dialogVisible = true;
          return false;
        }
      })
    },

    /**
     *  获取店铺信息
     */
    load() {
      this.axios.get(
        '/shop/getShopByUserId',
        {
          params: {id : this.$store.state.user.userInfo.user.user_id}
        }
      ).then(
        (resp) => {
          console.log(resp.data)
          this.form.shop_id = resp.data.shop_id
            this.form.shop_name = resp.data.shop_name
            this.form.shop_image = resp.data.shop_image
            this.form.shop_describe = resp.data.shop_describe
            this.form.shop_turnover = resp.data.shop_turnover
            this.form.shop_userid = resp.data.shop_userid
            this.form.shop_username = resp.data.shop_username
            this.form.shop_visits = resp.data.shop_visits
            this.form.shop_address = resp.data.shop_address
            this.form.shop_phone  = resp.data.shop_phone
            if(resp.data.shop_status == "true") {
              this.form.shop_status = true
              this.axios.get(
                'commodity/getCommodityByShopId',
                { params: { id: this.form.shop_id}}
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
                        //this.$confirm('修改商品上架成功')
                      }
                    )
                  }
                })

            }else {
              this.form.shop_status = false
              this.axios.get(
                'commodity/getCommodityByShopId',
                { params: { id: this.form.shop_id}}
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
                        //this.$confirm('修改商品下架成功')
                      }
                    )
                  }
                })
            }
            this.form.createTime  = resp.data.createTime
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },
    //封面上传
    handleAvatarSuccess(res, file) {
      this.form.shop_image = this.axios.defaults.baseURL + '/' + res[0];
    },
    beforeAvatarUpload(file) {
    },
  },

  mounted() {
    this.load()
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
