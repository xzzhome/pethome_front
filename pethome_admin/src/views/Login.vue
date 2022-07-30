<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="logining">登录</el-button>
      <el-button type="success" style="width:48%;" @click.native.prevent="goRegister">店铺入驻</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          username: '18708146211',
          password: '1',
          loginType: 0
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      //店铺入驻
      goRegister() {
        this.$router.push({ path: '/register' });//要跳转到路由的路径 - 之间登录成功之后的跳转代码
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      //登录
      login() {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true; //显示忙等框
            this.$http.post("/login/account",this.ruleForm2).then(res=>{
              this.logining = false; //不管失败和成功：都要去掉忙等框
              if(res.data.success){
                this.$message({
                  message: "登录成功",
                  type: 'success'
                });
                //2.将token和logininfo保存到localStrorage中
                let {token,logininfo}  = res.data.resultObj;  //解构表达式：快捷获取
                localStorage.setItem("token",token);
                //注意：保存的是json格式的字符串，那么获取的时候需要进行转换才能使用json对象
                localStorage.setItem("logininfo",JSON.stringify(logininfo));//拿到的是一个对象，需要转成json格式字符串
                //3.跳转到首页
                this.$router.push({path: '/echarts'});
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            }).catch(res=>{
              this.$message({
                message: "系统错误",
                type: 'error'
              });
            })
          } else {
            this.$message.error("验证不通过，提交失败!");
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>