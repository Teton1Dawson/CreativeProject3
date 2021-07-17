import Vue from 'vue'
import VueRouter from 'vue-router'
import NoteList from '../views/NoteList.vue'
import Note from '../views/Note.vue'
import Folder from '../views/FolderList.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/folder',
    name: 'Folder',
    component: Folder
  },
  {
    path: '/folder/:folderid/note/:id',
    name: 'Notes',
    component: Note
  },

  {
    path: '/folder/:id',
    name: 'NoteList',
    component: NoteList
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
