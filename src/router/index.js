import Vue from 'vue'
import Router from 'vue-router'
// 引入header组件
import goods from '@/components/goods/goods'
import seller from '@/components/seller/seller'
import ratings from '@/components/ratings/ratings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 默认重定向
      path: '*',
      redirect: '/goods'
    },
    {
      // 路由路径 在router-link表现中的to属性中使用
      path: '/goods',
      name: 'v-goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'v-seller',
      component: seller
    },
    {
      path: '/ratings',
      name: 'v-ratings',
      component: ratings
    }
  ]
})
