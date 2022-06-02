<template>
  <body id="poster">
    <div>
      <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
        <h3 class="login-title">欢迎注册</h3>
        <el-form-item label="头像" prop="u_image">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="form.u_url"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.u_image" :src="form.u_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" type="text" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordTrue">
          <el-input v-model="form.passwordTrue" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item label="家庭资产" prop="asset">
          <el-input v-model="form.asset" type="text" placeholder="请输入家庭资产" />
        </el-form-item>
        <el-form-item label="个人资产" prop="u_assets">
          <el-input v-model="form.u_assets" type="text" placeholder="请输入个人资产" />
        </el-form-item>
        <el-form-item label="电话" prop="u_phone">
          <el-input v-model="form.u_phone" type="text" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" type="text" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">登录</el-button>
          <el-button type="danger" @click="toRegister('loginForm')">注册</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>请填写完整信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </body>
</template>

<script>
import validator, { validateEMail, validatePhone } from '../../utils/validator'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '', // 真实姓名
        password: '', // 确认密码
        u_url: 'http://127.0.0.1:8083/imgUpload',
        u_image: '', // 头像
        passwordTrue: '',
        asset: '', // 家庭资产
        u_assets: '', // 个人资产
        u_phone: '', // 电话号码
        address: ''// 家庭地址
      },
      // 表单验证，需要再el-form-item 元素中增加prop属性
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        u_image: { required: true, message: '请上传头像', trigger: 'change' },
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],

        passwordTrue: [{ required: true, message: '密码不能为空', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
        ],
        u_assets: [{ required: true, message: '个人资产不能为空', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(value)) {
              callback(new Error('数额不正确'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        asset: [{ required: true, message: '家庭资产不能为空', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(value)) {
              callback(new Error('数额不正确'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        u_phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }, { validator: validatePhone, message: '电话输入不合法', trigger: 'blur' }],
        address: [{ required: true, message: '家庭住址不能为空', trigger: 'blur' }]
      },
      // 对话框显示和隐藏
      dialogVisible: false
    }
  },
  methods: {
    onSubmit() {
      this.$router.push('/')
    },

    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      this.form.u_image = this.axios.defaults.baseURL + '/' + res[0]
      console.log(this.form.u_image)
      console.log('url' + this.form.u_url)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },

    toRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.get(
            '/user/registerUser',
            {
              params: {
                u_name: this.form.username,
                u_password: this.form.password,
                u_phone: this.form.u_phone,
                u_assets: this.form.u_assets,
                u_image: this.form.u_image,
                f_assets: this.form.asset,
                address: this.form.address
              }
            }
          ).then(
            (info) => {
              console.log(info)
              if (info.data == '1') {
                this.$confirm('注册成功！')
                // this.$router.push("/login");
              } else if (info.data == '') {
                this.$confirm('注册失败！')
              } else {
                this.$confirm(info.data)
              }
            }
          ).catch( // 请求成功 确进入这个方法，说明，then方法有问题
            (failResponse) => {
              this.$confirm('网络异常！')
            }
          )
        } else {
          this.dialogVisible = true
          return false
        }
      }
      )
    },

    handleClose() {

    }
  }
}
</script>

<style lang="scss" scoped>
.login-box{
  border: 1px solid #DCDFE6;
  width: 350px;
  margin:180px auto;
  padding:35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow:0 0 25px #909399;
}

.login-title{
  text-align:center;
  margin:0 auto 40px auto;
  color:#303133;
}

#poster {
  background:url("../../assets/10a3e8e8160b063cfbeea248d20fb8c5.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body{
  margin: 0px;
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
</style>
