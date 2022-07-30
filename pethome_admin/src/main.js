import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'

//引入axios
import axios from "axios";
axios.defaults.baseURL='http://localhost:8080';
Vue.prototype.$http=axios;

import routes from './routes'

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

//======================路由的前端拦截器【拦截不到后端的请求】====================//
router.beforeEach((to, from, next) => {
  if (to.path == '/login' || to.path == "/register") {
    localStorage.removeItem("token");
    localStorage.removeItem("logininfo");
    next();//放行
  }else{
    let logininfo = localStorage.getItem('logininfo');
    if (logininfo) {
      next();
    } else {
      next({path: '/login'});//跳转到login
    }
  }
})

//======================axios的前置拦截器【拦截调用后端的请求，在这个请求头加token，保持登录状态】====================//
axios.interceptors.request.use(res=>{
  let token = localStorage.getItem("token");
  if(token){
    res.headers["token"] = token;
  }
  return res;
},error => {
  Promise.reject(error)
})

//======================axios的后置拦截器【处理后台登录拦截的结果】====================//
axios.interceptors.response.use(res => {
  //后端响应的是没有登录的信息
  if (false === res.data.success && "noLogin" === res.data.msg) {
    router.push({path: '/login'});
  }
  return res;
},error => {
  Promise.reject(error)
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

