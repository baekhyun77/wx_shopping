import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/index',
    name: 'index',
    component: Layout,
    redirect: '/index/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    path: '/shops',
    component: Layout,
    redirect: '/shops/shop',
    name: 'shops',
    meta: { title: '店铺管理', icon: 'shop' },
    children: [
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/shop/shop'),
        meta: {requireAuth: true,title: '我的店铺', icon: 'shop1' }
      },
      {
        path: 'commodity',
        name: 'commodity',
        component: () => import('@/views/shop/commodity'),
        meta: {requireAuth: true,title: '商品管理', icon: 'commodity' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/myOrder',
    name: 'order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: 'myOrder',
        name: 'myOrder',
        component: () => import('@/views/myOrder/myOrder'),
        meta: {requireAuth: true, title: '订单管理', icon: 'order' }
      },
    ]
  },

  {
    path: '/chats',
    component: Layout,
    redirect: '/chats/chat',
    name: 'chats',
    meta: { title: '接待管理', icon: 'msg' },
    children: [
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/chat/chat'),
        meta: {requireAuth: true, title: '接待管理', icon: 'msg ' }
      }
    ]
  },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
