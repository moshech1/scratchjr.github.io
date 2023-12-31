import { UserLayout, TabLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'
import HomeLayout from '@/views/home/HomeLayout'
/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [
  // {
  //   path: '/',
  //   name: 'dashboard',
  //   component: TabLayout,
  //   meta: { title: '首页' },
  //   redirect: '/dashboard/analysis',
  //   children: [
  //   ]
  // },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'alteration',
        name: 'alteration',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Alteration')
      },
    ]
  },
  {
    path: '/',
    name: 'index',
    component: HomeLayout,
    meta: {title: '首页'},
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'publicWork',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/Index')
      },
      {
        path: 'workList',
        name: 'workList',
        component:() => import(/* webpackChunkName: "home" */ '@/views/home/WorkList')
      },
      {
        path: 'courseList',
        name: 'courseList',
        component:() => import(/* webpackChunkName: "home" */ '@/views/home/CourseList')
      }
    ]
  },
  {
    path: '/work-detail',
    name: 'workDetail',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/WorkDetail')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
