<!--<script src="../../common/js/quill-config.js"></script>-->
<template>
  <section>
    <!--工具条：关键字查询 + 新增-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="keywordQuery">关键字查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsale">上架</el-button>
          <el-button type="primary" @click="offsale">下架</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table :data="pets" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80">
      </el-table-column>
      <el-table-column prop="saleprice" label="销售价" width="80">
      </el-table-column>
      <el-table-column prop="costprice" label="成本价" width="80">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80" sortable>
        <!-- 自定义模板：通过scope可以获取到当前行对象：scope.row -->
        <template scope="scope">
          <span style="color: green" v-if="scope.row.state==1">上架</span>
          <span style="color: red" v-else-if="scope.row.state==0">下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="type.name" label="类型" width="80" sortable>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="onsaletime" label="上架时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="offsaletime" label="下架时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="shop.name" label="所在店铺" width="100" sortable>
      </el-table-column>
      <el-table-column prop="user.username" label="领养用户" width="100" sortable>
      </el-table-column>
      <el-table-column prop="search_master_msg_id" label="来源" width="100" sortable>
        <template scope="scope">
          <span style="color: green" v-if="scope.row.search_master_msg_id">来自寻主</span>
          <span style="color: red" v-else>店铺饲养</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove"
                 :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="totals" :current-page="currentPage" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 添加和修改的对话框 -->
    <el-dialog :title="title" :visible.sync="saveFormVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="saveForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="costprice">
          <el-input v-model="saveForm.costprice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="销售价" prop="saleprice">
          <el-input v-model="saveForm.saleprice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在店铺"  prop="shop_id">
          <el-select v-model="saveForm.shop_id" value-key="id" placeholder="请选择" clearable>
            <el-option
                v-for="item in shops"
                :label="item.name"
                :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tel }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type" >
          <el-cascader v-model="saveForm.type"
                       :options="typeTree"
                       :props="{
                          checkStrictly: true,
                          label: 'name', //级联框显示那个属性的值
                          value: 'id'    //回显时需要,回传值的时候也需要
                        }" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="资源" prop="resources">
          <el-upload class="upload-demo"
                     action="http://localhost:8080/fastDfs"
                     :on-remove="handleRemove"
                     :on-success="handleSuccess"
                     :file-list="fileList"
                     list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <!-- v-if="saveForm.petDetail"  v-model绑定对象报错问题，v-if对需要显示的数据判断下 -->
          <quill-editor  v-model="saveForm.petDetail.intro" v-if="saveForm.petDetail" :options="quillOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="领养须知" prop="orderNotice" >
          <quill-editor  v-model="saveForm.petDetail.adoptNotice" v-if="saveForm.petDetail" :options="quillOption">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
//引入Vue的ueditor的资源
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import quillConfig from '../../common/js/quill-config';

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      quillOption: quillConfig,
      //分页显示所属数据
      pets: [],
      listLoading: false,
      currentPage: 1,
      pageSize: 5,
      totals: 0,

      //高级查询所需数据
      keyword: null,

      //多条数据选中
      sels: [],//列表选中列

      //添加或修改数据
      saveFormVisible: false,//添加或修改界面是否显示
      saveLoading: false,
      title: null,
      saveFormRules: {
        name: [
          { required: true, message: '请输入宠物名称', trigger: 'blur' }
        ],
        costprice: [
          { required: true, message: '请输入成本价', trigger: 'blur' }
        ],
        saleprice: [
          { required: true, message: '请输入销售价', trigger: 'blur' }
        ],
        shop_id: [
          { required: true, message: '请选择所在店铺', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择宠物类型', trigger: 'blur' }
        ]
      },
      saveForm: {
        id: null,
        name: '',
        costprice: null,
        saleprice: null,
        shop_id: null,
        type_id: null,
        type: null,
        resources: '',
        petDetail:{
          intro: '',
          adoptNotice: ''
        }
      },

      //宠物所在店铺
      shops: [],
      //宠物类型数
      typeTree: [],

      //资源图片
      fileList: [],
    }
  },
  methods: {
    //上架
    onsale(){
      var ids = this.sels.map(item => item.id);
      //获取选中的行
      if(!this.sels || this.sels.length  <1){
        this.$message({ message: '老铁，你不选中数据，臣妾上架不了啊....',type: 'error'});
        return;
      }
      this.$confirm('确认上架选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.post('/pet/onsale',ids).then((res) => {
          this.listLoading = false;
          if(res.data.success){
            this.$message({
              message: '上架成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
          this.getPets();
        }).catch(res => {
          this.$message({
            message: "系统错误，请稍后重试!!!",
            type: 'error'
          });
        })
      }).catch(() => {
      });
    },

    //下架
    offsale(){
      var ids = this.sels.map(item => item.id);
      //获取选中的行
      if(!this.sels || this.sels.length  <1){
        this.$message({ message: '老铁，你不选中数据，臣妾下架不了啊....',type: 'error'});
        return;
      }
      this.$confirm('确认下架选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.post('/pet/offsale',ids).then((res) => {
          this.listLoading = false;

          if(res.data.success){
            this.$message({
              message: '下架成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
          this.getPets();
        }).catch(res => {
          this.$message({
            message: "系统错误，请稍后重试!!!",
            type: 'error'
          });
        })
      }).catch(() => {
      });
    },

    //获取宠物列表
    getPets() {
      let paras = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      this.listLoading = true;
      this.$http.post("/pet",paras).then(res => {
        this.totals = res.data.totals;
        this.pets = res.data.data;
        this.listLoading = false;
      }).catch(res => {
        this.$message.error("获取分页数据失败!!!");
      })
    },

    //关键字查询
    keywordQuery(){
      this.currentPage = 1;
      this.getPets();
    },

    //分页查询 - 点击某一页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPets();
    },

    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/pet/" + row.id).then(res => {
          this.listLoading = false;
          if(res.data.success){
            //计算总页数
            let totalPage = this.totals%this.pageSize==0?this.totals/this.pageSize
                :Math.ceil(this.totals/this.pageSize);
            if(this.currentPage > 1 && this.currentPage==totalPage && (this.totals-1)%this.pageSize==0){
              this.currentPage = this.currentPage - 1;
            }
            this.getPets();
          }else{
            this.$message.error("删除失败【500】");
          }
        }).catch(res => {
          this.$message.error("系统错误【400,404】");
        })
      }).catch(() => {
        //确认框点击取消之后走这里
      });
    },

    //点击修改按钮弹出模态框
    handleEdit: function (index, row) {
      this.title = "编辑";
      this.saveForm = Object.assign({}, row);
      this.getShops();
      this.getTypeTree();

      //图片回显
      this.fileList = [];
      var resources =  row.resources;
      if(resources){
        var resourcesArr = resources.split(",");
        for(var i=0;i<resourcesArr.length;i++){
          this.fileList.push({url:"http://123.207.27.208"+resourcesArr[i]})
        }
      }

      //对上级部门回显做处理：
      let dirPath = row.type.dirPath;// /2/5/10 - [2,5]
      let dirArr = dirPath.split("/");
      var arr = [];
      for(var i = 1 ; i < dirArr.length ; i++){
        arr[i-1] = parseInt(dirArr[i]);
      }
      this.saveForm.type = arr;
      this.saveFormVisible = true;
      //显示详情
      /*this.$http.get("/pet/detail/"+row.id).then(result=>{
        this.saveForm.petDetail = result.data;
        //异步请求：先查询到数据在显示模态框 - 否则数据回显不了
        this.saveFormVisible = true;
      });*/

    },

    //点击添加按钮弹出模态框
    handleAdd: function () {
      this.title = "添加";
      this.saveForm = {
        id: null,
        name: '',
        costprice: null,
        saleprice: null,
        shop_id: null,
        type_id: null,
        type: null,
        resources: '',
        petDetail:{
          intro: '',
          adoptNotice: ''
        }
      };

      //清空列表
      this.fileList = [];

      this.getShops();
      this.getTypeTree();
      this.saveFormVisible = true;
    },

    //点击对话框提交数据
    saveSubmit: function () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.saveLoading = true;
            let paras = Object.assign({}, this.saveForm);

            //提交数据时上级部门数据格式做处理：[3,8] - {id:8}
            var arr = this.saveForm.type; //[ 3, 8 ]
            if(arr){
              //防止400错误
              paras.type = null;
              paras.type_id = arr[arr.length-1]
            }

            this.$http.put("/pet",paras).then(res => {
              this.saveFormVisible = false;
              this.saveLoading = false;
              if(res.data.success){
                this.$message.success("操作成功");
                this.getPets();
              }else{
                this.$message.error("操作失败【500】");
              }
            }).catch(res => {
              this.$message.error("系统错误【400,404】");
            })
          });
        }
      });
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.patch("/pet",ids).then(res => {
          this.listLoading = false;
          if(res.data.success){
            this.currentPage = 1;
            this.getPets();
          }else{
            this.$message.error("批量删除失败【500】");
          }
        }).catch(res => {
          this.$message.error("系统错误【400,404】");
        })
      }).catch(() => {
      });
    },

    getShops(){
      this.$http.get("/shop").then(res => {
        this.shops = res.data;
      })
    },

    //获取部门树 - 无线级联
    getTypeTree(){
      this.$http.get("/petType/typeTree").then(res => {
        this.typeTree = res.data;
      })
    },

    //资源图片上传成功之后的处理
    handleSuccess(response, file, fileList){
      //处理resources - 数据库操作
      if(this.saveForm.resources){ //有值  /group1/M00/00/72/rBEAA2BHkmaAbEOhAAEUusLjqqk505.png
        this.saveForm.resources = this.saveForm.resources + "," + response.resultObj;
      }else{
        this.saveForm.resources = response.resultObj;
      }

      //处理fileList - 页面回显的
      this.fileList = [];//清空
      if(this.saveForm.resources){
        // /group1/M00/02/1B/rBE3kWHB-cCASterAACabDprSz419.jpeg,/group1/M00/02/1B/rBE3kWHB-caAQ3dYAABiwl7Ttcc206.jpg
        var resourcesArr = this.saveForm.resources.split(",");
        for(var i=0;i<resourcesArr.length;i++){
          this.fileList.push({url:"http://123.207.27.208"+resourcesArr[i]})
        }
      }
    },

    //资源图片点击删除时的处理
    handleRemove(file, fileList) {
      if(fileList==null || fileList.length==0){
        return;
      }
      console.log("=====图片删除的回调======")
      console.log(file)

      //删除fastDfs上的图片
      var filePath =file.url; // http://123.207.27.208/group1/M00/02/1E/rBE3kWHL_GWAAv5mAADpQr0XCJA99.jpeg
      //删除接口需要：/group1/M00/02/1E/rBE3kWHL_GWAAv5mAADpQr0XCJA99.jpeg
      var path = filePath.substring(filePath.indexOf("/group1")); // /group1/M00/02/1E/rBE3kWHL_GWAAv5mAADpQr0XCJA99.jpeg
      this.$http.delete("/fastDfs/?path="+path).then(res=>{
        if(res.data.success){
          this.$message.success('删除成功!!!');
        }else{
          this.$message.error('删除失败!!!');
        }
      })

      // /group1/M00/02/1B/rBE3kWHB-cCASterAACabDprSz419.jpeg,/group1/M00/02/1E/rBE3kWHL_GWAAv5mAADpQr0XCJA99.jpeg,/group1/M00/02/1B/rBE3kWHB-caAQ3dYAABiwl7Ttcc206.jpg
      //处理resources - 数据库操作
      if(this.saveForm.resources){
        //["/group1/M00/02/1B/rBE3kWHB-cCASterAACabDprSz419.jpeg","/group1/M00/02/1E/rBE3kWHL_GWAAv5mAADpQr0XCJA99.jpeg"]
        var pathArr = this.saveForm.resources.split(",");
        console.log(pathArr);
        for(var i = 0 ;i<pathArr.length;i++){
          var pathTemp = pathArr[i];
          if(pathTemp == path){ //你要删除的图片找到了
            //从下标为i的地方开始删除，删1个
            pathArr.splice(i,1);
            break;
          }
        }
        this.saveForm.resources = pathArr.join(",");
      }

      //处理fileList - 页面回显的
      this.fileList = [];//清空
      if(this.saveForm.resources){
        // /group1/M00/02/1B/rBE3kWHB-cCASterAACabDprSz419.jpeg,/group1/M00/02/1B/rBE3kWHB-caAQ3dYAABiwl7Ttcc206.jpg
        var resourcesArr = this.saveForm.resources.split(",");
        for(var i=0;i<resourcesArr.length;i++){
          this.fileList.push({url:"http://123.207.27.208"+resourcesArr[i]})
        }
      }
    },

  },

  mounted() {
    //分页查询 - 页面一加载查询
    this.getPets();
  }
}

</script>

<style scoped>

</style>