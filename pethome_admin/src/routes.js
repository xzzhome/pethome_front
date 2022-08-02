import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Table from './views/nav1/Table.vue'
import echarts from './views/charts/echarts.vue'
import Department from "./views/ory/Department";
import Employee from "./views/ory/Employee";
import shop from "./views/ory/Shop";
import systemType from "./views/system/SystemType";
import systemDetail from "./views/system/SystemDetail";
import system from "./views/system/System";
import ShopRegister from "./views/ShopRegister";
import User from "./views/user/User";
import logininfo from "./views/user/Logininfo";
import Menu from "./views/system/Menu";
import Role from "./views/system/Role";
import Permission from "./views/system/Permission";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: ShopRegister,
        name: '', 	//不需显示name没有意义
        hidden: true //不需要在菜单显示
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        leaf: true,//只有一个子节点
        iconCls: 'el-icon-s-home',
        children: [
            { path: '/echarts', component: echarts, name: '首页' }
        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '组织机构模块',
        iconCls: 'el-icon-s-custom',//图标样式class
        children: [
            { path: '/department', component: Department, name: '部门管理' },
            { path: '/employee', component: Employee, name: '员工管理' },
            { path: '/shop', component: shop, name: '店铺管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-s-platform',
        children: [
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/permission', component: Permission, name: '权限管理' },
            { path: '/menu', component: Menu, name: '菜单管理' },
            { path: '/log', component: Table, name: '系统日志' },
            { path: '/systemType', component: systemType, name: '数据字典类型' },
            { path: '/systemDetail', component: systemDetail, name: '数据字典明细' },
            { path: '/system', component: system, name: '数据字典' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-s-platform',
        children: [
            { path: '/user', component: User, name: '用户管理' },
            { path: '/logininfo', component: logininfo, name: '用户登录管理' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;