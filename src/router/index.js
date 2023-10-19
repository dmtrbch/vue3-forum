import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ThreadShow from '@/views/ThreadShow.vue'
import NotFound from '@/views/NotFound.vue'
import sourceData from '@/data.json'
import Forum from '@/views/Forum.vue'
import Category from '@/views/Category.vue'
import Profile from '@/views/Profile.vue'
import ThreadCreate from '@/views/ThreadCreate.vue'
import ThreadEdit from '@/views/ThreadEdit.vue'
import { findById } from '@/helpers'
import { unsubscribeAllSnapshots } from '@/helpers'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      meta: { toTop: true, smoothScroll: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: { edit: true }
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
      // beforeEnter(to, from, next) {
      //   // called before the route that renders this component is confirmed.
      //   // does NOT have access to `this` component instance,
      //   // because it has not been created yet when this guard is called!
      //   const threadExists = findById(sourceData.threads, to.params.id)
      //   if (threadExists) {
      //     return next()
      //   } else {
      //     next({
      //       name: 'NotFound',
      //       params: { pathMatch: to.path.substring(1).split('/') },
      //       query: to.query,
      //       hash: to.hash
      //     })
      //   }
      // }
    },
    {
      path: '/forum/:forumId/thread/create',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.beforeEach(() => {
  unsubscribeAllSnapshots()
})

export default router
