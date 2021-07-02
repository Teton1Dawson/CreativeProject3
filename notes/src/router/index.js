import Vue from 'vue'
import VueRouter from 'vue-router'
import List from '../views/List.vue'
import Note from '../views/Note.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'List',
    component: List
  },
  {
    path: '/note/:id',
    name: 'Notes',
    component: Note
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
