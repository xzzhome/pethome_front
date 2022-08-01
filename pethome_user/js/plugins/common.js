//配置axios的全局基本路径
axios.defaults.baseURL='http://localhost:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios

//====前端拦截器：拦截不经过后端代码的请求【前端的有些页面是需要登录之后才能访问的】====
let url = location.href;
//alert(url);//http://localhost/index.html
if(url.indexOf("login.html")==-1
    && url.indexOf("register.html")==-1
    && url.indexOf("index.html")==-1
    && url.indexOf("callback.html")==-1
    && url.indexOf("binder.html")==-1
){
    let logininfo = localStorage.getItem("logininfo");
    if(!logininfo){//如果访问的不是登录页面和注册页面，并且loginInfo没有值【没有登录或过期】
        location.href = "/login.html";
    }
}

//====axios的前置拦截器:作用，每次访问后台【都是使用axios发送请求的】，都要将token携带到后端====
axios.interceptors.request.use(res=>{
    //从浏览器中获取token
    let token = localStorage.getItem("token");
    if(token){
        //将token添加到请求头
        res.headers["token"] = token;
    }
    return res;//语法格式，必须返回
})

//====axios的后置拦截器：作用，对后端响应的错误的json数据【没有登录，获取过期】做处理====
axios.interceptors.response.use(res => {
    //后端响应的是没有登录的信息
    if (!res.data.success && "noLogin" === res.data.msg) {
        localStorage.removeItem("token");
        localStorage.removeItem("logininfo");
        location.href = "/login.html";
    }
    return res;//语法格式，必须返回
})

//封装公用方法 - 将字符串的参数解析为json对象
function parseUrlParams2Obj(url) {
    let paramStr = url.substring(url.indexOf("?")+1);//xxx?code=xxx&state=1
    let paramArr = paramStr.split("&");
    let paramObj = {};
    for(let i = 0;i<paramArr.length;i++){
        let paramTemp = paramArr[i];
        let paramName = paramTemp.split("=")[0];
        let paramValue= paramTemp.split("=")[1];
        paramObj[paramName] = paramValue;
    }
    return paramObj;
}