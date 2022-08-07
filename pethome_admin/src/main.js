import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import './common/js/permission'

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
    localStorage.removeItem('token');
    localStorage.removeItem('logininfo');
    localStorage.removeItem('menus');
    localStorage.removeItem('permissions');
    // 继续
    next();
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
  //跳转登录页面
  if(!res.data.success && res.data.msg=='noLogin'){
    localStorage.removeItem("token");
    localStorage.removeItem("logininfo");
    localStorage.removeItem("permissions");
    localStorage.removeItem("menus");
    //跳转到登录页面
    router.push({path: '/login'});
  }else if(!res.data.success && res.data.msg=='noPermission'){
    alert("你没有权限访问该资源!!!")
  }else if(!res.data.success && res.data.msg=='timeout'){
    localStorage.removeItem("token");
    localStorage.removeItem("logininfo");
    localStorage.removeItem("permissions");
    localStorage.removeItem("menus");
    alert("jwt过期");
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



//处理页面刷新动态路由失效问题
initIndexRouters();
function initIndexRouters(){
  if(!localStorage.menus){
    return;
  }
  //防止重复配置路由：5就是main.js中路由的个数 - 如果你的静态路由是6个这里要写成6
  if(router.options.routes.length>4){
    return;
  }
  let menus = localStorage.getItem('menus');
  // 转成对象
  menus = JSON.parse(menus);
  let tempRouters = [];
  menus.forEach(menu=>{
    let indexRouter = {
      path: '/',
      iconCls: menu.icon,
      name: menu.name,
      component: resolve => require(['@/views/Home'], resolve),
      children: []
    }
    menu.children.forEach(cMenu=>{
      let cr = {
        path: cMenu.url,
        name: cMenu.name,
        component: resolve => require(['@/views/'+cMenu.component], resolve)
      }
      indexRouter.children.push(cr)
    })
    tempRouters.push(indexRouter)
    router.options.routes.push(indexRouter)
  })
  //动态路由配置
  router.addRoutes(tempRouters);
}
