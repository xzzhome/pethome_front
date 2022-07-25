<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="keyword" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="keywordQuery">关键字查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="exportData">导出</el-button>
        </el-form-item>
        <el-form-item>
          <!-- 默认name="file" -->
          <el-upload class="upload-demo"
                     action="http://localhost:8080/shop/importExcel"
                     list-type="text">
            <el-button type="warning">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
		</el-col>

		<!--列表-->
    <!--
        :data="shop" 绑定数据
        v-loading="listLoading" 加载框，忙等框
         highlight-current-row 高亮提示
         @selection-change="selsChange" 选中事件
    -->
    <el-table :data="shop" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.auditLogs" style="width: calc(100% - 47px)" class="two-list">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="props">
							  <span v-if="props.row.state ==1">
								  <span style="color:#00B46D">通过</span>
							  </span>
                <span v-else>
								  <span style="color:#D75C89">驳回</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
            <el-table-column prop="auditManager.username" label="审核人员"></el-table-column>
            <el-table-column prop="audit_time" label="审核时间"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" >
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150" sortable>
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="120" sortable>
      </el-table-column>
      <el-table-column prop="registerTime" label="入驻时间" width="120" sortable>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80" sortable>
        <template scope="scope">
          <span v-if="scope.row.state==1" style="color: hotpink">待审核</span>
          <span v-if="scope.row.state==2" style="color: blue">待激活</span>
          <span v-if="scope.row.state==3" style="color: green">正常使用</span>
          <span v-if="scope.row.state==4" style="color: red">驳回</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="logo" label="图标" min-width="100" sortable>
        <template scope="scope">
          <img :src="imgPrefix+scope.row.logo" width="50px">
        </template>
      </el-table-column>
      <el-table-column prop="admin.username" label="店长" min-width="80" sortable>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small" type="info"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="danger"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" type="warning" :disabled="scope.row.state!=1" @click="handleAudit(scope.$index, scope.row)">店铺审核</el-button>
        </template>
      </el-table-column>
    </el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>

			<el-pagination layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="totals"
                     style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面，模态框-->
		<el-dialog :title="title" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="店铺名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="店铺电话" prop="tel">
          <el-input v-model="editForm.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
					<el-input v-model="editForm.address" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="店铺logo" prop="logo">
					<el-input v-model="editForm.logo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="editForm.state">
						<el-radio class="radio" :label="1">待审核</el-radio>
						<el-radio class="radio" :label="2">待激活</el-radio>
						<el-radio class="radio" :label="3">正常使用</el-radio>
						<el-radio class="radio" :label="4">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="店长">
          <el-select clearable v-model="editForm.admin_id" placeholder="请选择">
            <el-option v-for="item in managers"
                       :label="item.username"
                       :value="item.id">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tel }}
		      </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

    <!-- 审核模态框 -->
    <el-dialog title="审核店铺" :visible.sync="shopAuditVisible" :close-on-click-modal="false">
      <el-form :model="shopAuditLog" label-width="80px"  ref="shopAuditLogForm">
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="shopAuditLog.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="shopAuditVisible = false">取消</el-button>
        <el-button type="primary" @click.native="auditPass">通过</el-button>
        <el-button type="primary" @click.native="auditReject">驳回</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
	export default {
    //定义模型数据
		data() {
			return {
        //列表显示图片的前缀
        imgPrefix:"http://123.207.27.208",
        //1.店铺数据列表的模型数据
        shop: [],//展示页面的数据
        listLoading: false,//加载框，默认不显示
        //2.分页数据
        totals: 0,
        currentPage: 1,
        pageSize: 5,
        //3.高级查询所需数据
        keyword: '',

        managers: [],//部门数据
        deptTree: [],//店铺树
				sels: [],//列表选中列，左边的勾勾
        title:'',
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入店铺名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: null,
          name: '',
          tel: '',
          address: '',
          logo: '',
          state: 1,
          admin_id: null
				},
        //审核模态框
        shopAuditVisible: false,
        //编辑界面数据
        shopAuditLog: {
          shopId: null,
          note:''
        }
			}
		},
		methods: {
      //1.获取店铺列表
      getShop() {
        //分页参数与高级查询参数，进行封装
        let para = {
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          //高级查询参数 - 关键字
          keyword: this.keyword
        };
        //加载框,忙等框
        this.listLoading = true;
        this.$http.post("/shop",para).then(res=>{
          this.listLoading = false;
          this.shop = res.data.data;
          this.totals = res.data.totals
        }).catch(res=>{
          this.$message.error("系统繁忙，请稍后重试")
        })
      },
      //2.当前页，分页数据展示
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getShop();
      },
      //3.关键字查询
      keywordQuery(){
        this.currentPage = 1;
        this.getShop();
      },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
          this.listLoading = true;
          //发送请求
          this.$http.delete("/shop/" + row.id).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$message.success("删除成功")
            } else {
              this.$message.error(res.data.msg);
            }
            this.getShop();//刷新页面
          }).catch(res => {
            this.$message.error("网络延迟");
          })
        }).catch(() => {
            //确认框点击取消之后走这里
          });

			},
			//显示编辑界面
			handleEdit: function (index, row) {
        this.title="编辑"
        //克隆数据：防止对象引用修改显示的数据
				this.editForm = Object.assign({}, row);
        this.getManagers();//点击编辑按钮，执行方法，获得经理数据
        this.editFormVisible = true;//弹出模态框
			},
			//显示新增界面
			handleAdd: function () {
        this.title="新增"
				this.editForm = {
          id: null,
          name: '',
          tel: '',
          address: '',
          logo: '',
          state: 1,
          admin_id: null
				};
        this.getManagers();//点击新增按钮，执行方法，获得经理数据
        this.editFormVisible = true;
			},
			//编辑和添加的提交按钮
			editSubmit: function () {
        //表单校验
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//克隆数据
							let para = Object.assign({}, this.editForm);
              this.$http.put("/shop",para).then(res=>{
                this.editLoading = false;//关忙等框
                this.editFormVisible = false;//关模态框
                if (res.data.success){
                  this.$message.success("操作成功")
                }else {
                  this.$message.error(res.data.msg)
                }
                this.getShop();
              }).catch(res=>{
                this.$message.error("前端错误")
              })
						});
					}
				});
			},
      //勾选时，将本行数据，读取到前端data里面的sels中
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
        // 将数据sels,通过map方法循环导出单个属性id及其值,读取所有勾选的id，组成的数组[1,2,3,4]
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				})
        .then(() => {
          this.listLoading = true;
          //发送请求
          this.$http.patch("/shop/",ids).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$message.success("删除成功")
            } else {
              this.$message.error(res.data.msg);
            }
            this.getShop();//刷新页面
          }).catch(res => {
            this.$message.error("网络延迟");
          })
				}).catch(() => {
          //确认框点击取消之后走这里
				});
			},
      //获取店铺经理
      getManagers(){
        this.$http.get("/employee").then(res => {
          this.managers = res.data;
        })
      },
      //点击店铺审核弹出模态框
      handleAudit: function (index, row) {
        this.shopAuditLog.shop_id = row.id;
        this.shopAuditVisible = true;
      },
      //审核通过
      auditPass(){
        this.$http.post("/shop/audit/pass",this.shopAuditLog).then(result=>{
          result = result.data;
          if(result.success){
            this.$message({
              message: '审核通过',
              type: 'success'
            });
          }else{
            this.$message({
              message: '审核失败',
              type: 'error'
            });
          }
          this.shopAuditVisible = false;
          this.getShop();
        })
      },
      //审核驳回
      auditReject(){
        this.$http.post("/shop/audit/reject",this.shopAuditLog).then(res=>{
          if(res.data.success){
            this.$message({
              message: '驳回成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: '驳回失败',
              type: 'error'
            });
          }
          this.shopAuditVisible = false;
          this.getShop();
        })
      },
      //导出
      exportData(){
        location.href="http://localhost:8080/shop/export";
      }
		},
		mounted() {
			this.getShop();
		}
	}

</script>

<style scoped>

</style>