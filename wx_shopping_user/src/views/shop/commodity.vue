<template>
  <div>
    <el-alert style="background-color: #409EFF; color: #222222; font-style: unset; margin-top: 10px; margin-bottom: 20px" :closable="false" title="个人商品"  />
    <el-button  style=" margin-bottom: 20px; margin-left: 20px" type="primary" @click="addCommodityDialog = true"><i class="el-icon-circle-plus-outline"></i>添加商品</el-button>


    <el-table  :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)">
      <el-table-column prop="commodity_name" label="商品名称" >
      </el-table-column>
      <el-table-column label="封面" >
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="mouseOver(scope.row)" >预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_price" label="价格" >
      </el-table-column>
      <el-table-column prop="commodity_typename" label="类型" >
      </el-table-column>
      <el-table-column prop="commodity_num" label="库存" >
      </el-table-column>
      <el-table-column prop="commodity_describe" label="描述" >
      </el-table-column>
      <el-table-column prop="user_root_id" label="团购">
        <template scope="scope">
          <el-tag v-if="scope.row.commodity_group=='1'" type="success" size="small" plain>已开启</el-tag>
          <el-tag v-if="scope.row.commodity_group=='0'" type="danger" size="small" plain>已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_discount" label="团购折扣" />
      <el-table-column prop="commodity_group_num" label="最低团购数量" />
      <el-table-column prop="commodity_sales" label="销量" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <el-tag type="success" size="small" plain v-if="scope.row.commodity_status == '1'" >已上架</el-tag>
          <el-tag type="danger" size="small" plain v-if="scope.row.commodity_status == '0'" >已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="initUpdateForm(scope.row)">编辑</el-button>
          <!--<el-button type="text" size="small" @click="deleteCommodity(scope.row)">删除</el-button>-->
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
    <el-dialog title="添加商品" :visible.sync="addCommodityDialog">
      <el-form :model="addForm">
        <el-form-item label="商品封面" prop="shop_image">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="u_url"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="addForm.commodity_image" :src="addForm.commodity_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品类型" prop="b_type">
          <el-select v-model="addForm.commodity_typename" placeholder="请选择商品类型" :value="addForm.commodity_typename">
            <!--          v-for循环遍历一个数组-->
            <el-option v-for="(item, index) in typeList" :key="index" v-bind:label="item.t_name"  v-bind:value='item.t_name'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="b_name">
          <el-input v-model="addForm.commodity_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="b_name">
          <el-input v-model="addForm.commodity_price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="b_name">
          <el-input v-model="addForm.commodity_num"></el-input>
        </el-form-item>
        <el-form-item label="开启团购">
          <el-switch v-model="addForm.commodity_group"></el-switch>
        </el-form-item>
        <el-form-item v-if="addForm.commodity_group" label="最低团购数量" prop="b_name">
          <el-input v-model="addForm.commodity_group_num"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.commodity_group" label="团购折扣" prop="b_name">
          <el-input v-model="addForm.commodity_discount" placeholder="请输入0-10以内的折扣数量"></el-input>
        </el-form-item>
        <el-form-item label="商品上下架">
          <el-switch v-model="addForm.commodity_status"></el-switch>
        </el-form-item>
        <el-form-item label="商品详情" prop="b_name">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addForm.commodity_describe">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCommodityDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCommodity">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改商品" :visible.sync="canUpdateForm">
      <el-form :model="updateForm">
        <el-form-item label="店铺封面" prop="shop_image">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="u_url"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload1">
            <img v-if="updateForm.commodity_image" :src="updateForm.commodity_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品类型" prop="b_type">
          <el-select v-model="updateForm.commodity_typename" placeholder="请选择商品类型" :value="updateForm.commodity_typename">
            <!--          v-for循环遍历一个数组-->
            <el-option v-for="(item, index) in typeList" :key="index" v-bind:label="item.t_name"  v-bind:value='item.t_name'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="b_name">
          <el-input v-model="updateForm.commodity_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="b_name">
          <el-input v-model="updateForm.commodity_price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="b_name">
          <el-input v-model="updateForm.commodity_num"></el-input>
        </el-form-item>
        <el-form-item label="开启团购">
          <el-switch v-model="updateForm.commodity_group"></el-switch>
        </el-form-item>
        <el-form-item v-if="updateForm.commodity_group" label="最低团购数量" prop="b_name">
          <el-input v-model="updateForm.commodity_group_num"></el-input>
        </el-form-item>
        <el-form-item v-if="updateForm.commodity_group" label="团购折扣" prop="b_name">
          <el-input v-model="updateForm.commodity_discount" placeholder="请输入0-10以内的折扣数量"></el-input>
        </el-form-item>
        <el-form-item label="商品上下架">
          <el-switch v-model="updateForm.commodity_status"></el-switch>
        </el-form-item>
        <el-form-item label="商品详情" prop="b_name">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="updateForm.commodity_describe">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canUpdateForm = false">取 消</el-button>
        <el-button type="primary" @click="updateCommodity">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="预览" width="30%"  :visible.sync="showUserImg">
      <el-image :src="imageUrl" ></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "commodity",
  data() {
    return {
      addCommodityDialog: false,

      imageUrl: '',//预览图像的地址
      showUserImg: false,
      u_url: 'http://127.0.0.1:8083/imgUpload',//图片上传地址
      //添加表单
      typeList: [],
      addForm: {
        commodity_name : '',
        commodity_price : '',
        commodity_userid : '',
        commodity_typename : '',
        commodity_typeid : '',
        commodity_num : '',
        commodity_image : '',
        commodity_shopid : '',
        commodity_shopname : '',
        commodity_describe : '',
        commodity_group_num: 0,
        commodity_group : false,
        commodity_discount : '',
        commodity_sales : '',
        commodity_status : false,
      },

      /**
       * 编辑相关
       **/
      canUpdateForm: false,
      updateForm: {
        commodity_id : '',
        commodity_name : '',
        commodity_price : '',
        commodity_userid : '',
        commodity_typename : '',
        commodity_num : '',
        commodity_image : '',
        commodity_shopid : '',
        commodity_shopname : '',
        commodity_describe : '',
        commodity_group_num: 0,
        commodity_group : false,
        commodity_discount : '',
        commodity_sales : '',
        commodity_status : false,
      },

      tableData: [],
      // 默认显示第几页
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

    updateCommodity() {
      let group = '1'
      let status = '1'
      if(this.updateForm.commodity_group == true) group = '1';
      else group = '0';
      if(this.updateForm.commodity_status == true) status = '1';
      else status = '0';
      if(this.updateForm.commodity_name==''){
        this.$confirm("商品名称为空！");
        this.canUpdateForm = false;

      }
      else if(this.updateForm.commodity_price==''){
        this.$confirm("商品价格为空！");
        this.canUpdateForm = false;
      }
      else if(this.updateForm.commodity_typename==''){
        this.$confirm("商品类型为空！");
        this.canUpdateForm = false;
      }
      else if(this.updateForm.commodity_num==''){
        this.$confirm("商品库存为空！");
        this.canUpdateForm = false;
      }
      else if(this.updateForm.commodity_describe==''){
        this.$confirm("商品介绍为空！");
        this.canUpdateForm = false;
      }
      else if(this.updateForm.commodity_image==''){
        this.$confirm("商品图片为空！");
        this.canUpdateForm = false;
      }
      else{
        this.axios.post(
          '/commodity/updateCommodity',
          {
            commodity_id: this.updateForm.commodity_id,
            commodity_name : this.updateForm.commodity_name,
            commodity_price : this.updateForm.commodity_price,
            commodity_typename : this.updateForm.commodity_typename,
            commodity_num : this.updateForm.commodity_num,
            commodity_image : this.updateForm.commodity_image,
            commodity_describe : this.updateForm.commodity_describe,
            commodity_group : group,
            commodity_group_num: this.updateForm.commodity_group_num,
            commodity_discount : this.updateForm.commodity_discount,
            commodity_status : status,
          }
        ).then(
          (resp) => {
            this.$confirm("修改成功！");
            this.canUpdateForm = false;
            this.load();
          }
        ).catch(
          (resp) => {
            this.$confirm("网络异常！");
          }
        )
      }


    },

    /**
     * 初始化修改表单
     **/
    initUpdateForm(row) {
      this.axios.get(
        '/commodity/adminGetCommodity',//管理员获取详情
        {params : {id : row.commodity_id}}
      ).then(
        (resp) => {
          this.canUpdateForm = true;
          this.updateForm.commodity_id = resp.data.commodity_id;
          this.updateForm.commodity_name = resp.data.commodity_name;
          this.updateForm.commodity_price  = resp.data.commodity_price;
            this.updateForm.commodity_typename  = resp.data.commodity_typename;
            this.updateForm.commodity_num   = resp.data.commodity_num;
            this.updateForm.commodity_image  = resp.data.commodity_image;
            this.updateForm.commodity_describe   = resp.data.commodity_describe;
            this.updateForm.commodity_group_num  = resp.data.commodity_group_num;
            if(resp.data.commodity_group == '1')
            this.updateForm.commodity_group   = true;
            else  this.updateForm.commodity_group = false;
            this.updateForm.commodity_discount   = resp.data.commodity_discount;
            this.updateForm.commodity_sales = resp.data.commodity_sales;
            if(resp.data.commodity_status == '1')
            this.updateForm.commodity_status  = true;
            else  this.updateForm.commodity_status = false;
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },


    /**
     * 添加商品
     */
    addCommodity() {
      let group = '1'
      let status = '1'
      if(this.addForm.commodity_group == true) group = '1';
      else group = '0';
      if(this.addForm.commodity_status == true) status = '1';

      else status = '0';
      if(this.addForm.commodity_name==''){
        this.$confirm("商品名称为空！");
        this.addCommodityDialog = false;

      }
      else if(this.addForm.commodity_price==''){
        this.$confirm("商品价格为空！");
        this.addCommodityDialog = false;
      }
      else if(this.addForm.commodity_typename==''){
        this.$confirm("商品类型为空！");
        this.addCommodityDialog = false;
      }
      else if(this.addForm.commodity_num==''){
        this.$confirm("商品库存为空！");
        this.addCommodityDialog = false;
      }
      else if(this.addForm.commodity_describe==''){
        this.$confirm("商品介绍为空！");
        this.addCommodityDialog = false;
      }
      else if(this.addForm.commodity_image==''){
        this.$confirm("商品图片为空！");
        this.addCommodityDialog = false;
      }
      else{
        this.axios.post(
          '/commodity/addCommodity',
          {
            commodity_name : this.addForm.commodity_name,
            commodity_price : this.addForm.commodity_price,
            commodity_userid : this.$store.state.user.userInfo.user.user_id,
            commodity_typename : this.addForm.commodity_typename,
            commodity_num : this.addForm.commodity_num,
            commodity_image : this.addForm.commodity_image,
            commodity_shopid : this.addForm.commodity_shopid,
            commodity_shopname : this.addForm.commodity_shopname,
            commodity_describe : this.addForm.commodity_describe,
            commodity_group : group,
            commodity_group_num: this.addForm.commodity_group_num,
            commodity_discount : this.addForm.commodity_discount,
            commodity_status : status,
          }
        ).then(
          (resp) => {
            this.$confirm("添加成功！");
            this.addCommodityDialog = false;
            this.load();
          }
        ).catch(
          (resp) => {
            this.$confirm("网络异常！");
          }
        )
      }

    },

    deleteCommodity(row) {

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
    //预览
    mouseOver(row) {
      this.showUserImg = true;
      this.imageUrl = ''
      this.imageUrl = row.commodity_image
    },
    //封面上传
    handleAvatarSuccess(res, file) {
      this.addForm.commodity_image = this.axios.defaults.baseURL + '/' + res[0];
    },
    beforeAvatarUpload(file) {
    },
    //封面上传
    handleAvatarSuccess1(res, file) {
      this.updateForm.commodity_image = this.axios.defaults.baseURL + '/' + res[0];
    },
    beforeAvatarUpload1(file) {
    },
    /**
     * 获取所有类型
     */
    getAllType() {
      this.axios.get(
        '/type/getAllType',
      ).then(
        (resp) => {
          this.typeList = resp.data
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },

    /**
     * 获取店铺信息
     */
    getShopInfo() {
      this.axios.get(
        '/shop/getShopByUserId',
        {
          params: {id : this.$store.state.user.userInfo.user.user_id}
        }
      ).then(
        (resp) => {
          this.addForm.commodity_shopid = resp.data.shop_id;
          this.addForm.commodity_shopname = resp.data.shop_name;
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    },

    load() {
      this.axios.get(
        '/commodity/getCommodityByUserId',
        {
          params: {id : this.$store.state.user.userInfo.user.user_id}
        }
      ).then(
        (resp) => {
          this.tableData = resp.data;
          // 将数据的长度赋值给totalCount
          this.totalCount = resp.data.length
        }
      ).catch(
        (resp) => {
          this.$confirm("网络异常！");
        }
      )
    }
  },

  mounted() {
    this.getAllType();
    this.getShopInfo()
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
