import Vue from 'vue'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import NavBarStudio from '@/components/NavBarStudio.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      NavBar,
      default: () => import('@/views/home.vue')
    }
  },
  {
    path: '/login',
    name: 'login',
    components: {
      default: () => import('@/views/login.vue')
    }
  },
  {
    path: '/join',
    name: 'join',
    components: {
      default: () => import('@/views/join.vue')
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    components: {
      NavBarStudio,
      NavBar,
      default: () => import('@/views/Setting.vue')
    }
  },
  {
    path: '/channel/:id',
    components: {
      NavBar,
      default: () => import('@/views/Channel.vue')
    },
    children: [
      {
        path: '/',
        name: 'ChannelView',
        components: {
          default: () => import('@/views/Channel/ChannelView.vue')
        }
      }
    ]
  },
  {
    path: '/vuetubeStudio',
    //children 있을때는 네임 안넣는다. children
    components: {
      NavBarStudio,
      default: () => import('@/views/studio/VuetubeStudio.vue')
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/VuetubeStudio/Dashboard.vue')
      },
      {
        path: 'contents',
        name: 'Contents',
        component: () => import('@/views/VuetubeStudio/Contents.vue')
      },
      {
        path: 'edit',
        name: 'Edit',
        component: () => import('@/views/VuetubeStudio/Edit.vue'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
