import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/register',
    component: () => import('@/views/login/Register'),
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
    }
    ]
  },

  {
    path: '/users',
    component: Layout,
    redirect: '/users/user',
    name: 'Users',
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/users'),
        meta: {requireAuth: true,title: '用户列表', icon: 'user' }
      },
      {
        path: 'business',
        name: 'business',
        component: () => import('@/views/user/business'),
        meta: {requireAuth: true,title: '商家审核', icon: 'people' }
      }
    ]
  },


  {
    path: '/type',
    component: Layout,
    redirect: '/type/payType',
    name: 'type',
    meta: { title: '类型管理', icon: 'table' },
    children: [
      {
        path: 'payType',
        name: 'payType',
        component: () => import('@/views/type/AllType'),
        meta: { requireAuth: true, title: '类型管理', icon: 'edit' }
      }
    ]
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
        component: () => import('@/views/shops/shop'),
        meta: { requireAuth: true, title: '店铺管理', icon: 'shop' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    redirect: '/check/usercheck',
    name: 'Usercheck',
    meta: { title: '用户状态管理', icon: 'people' },
    children: [
      {
        path: 'Usercheck',
        name: 'Usercheck',
        component: () => import('@/views/check/usercheck'),
        meta: { requireAuth: true, title: '消息管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/announce',
    component: Layout,
    redirect: '/announce/newannounce',
    name: 'type',
    meta: { title: '公告管理', icon: 'table' },
    children: [
      {
        path: 'newannounce',
        name: 'newannounce',
        component: () => import('@/views/announce/newannounce'),
        meta: { requireAuth: true, title: '公告管理', icon: 'list' }
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
