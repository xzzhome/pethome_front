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
            { path: '/role', component: Table, name: '角色管理' },
            { path: '/permission', component: Table, name: '权限管理' },
            { path: '/menu', component: Table, name: '菜单管理' },
            { path: '/log', component: Table, name: '系统日志' },
            { path: '/systemType', component: systemType, name: '数据字典类型' },
            { path: '/systemDetail', component: systemDetail, name: '数据字典明细' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;