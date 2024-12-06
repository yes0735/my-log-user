import { createWebHistory, createRouter } from "vue-router"
import ErrorView from '@/views/ErrorView.vue'

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("@/views/HomeView.vue"),
    meta: { isMenu: true, dark: true },
  },
  {
    path: "/about",
    name: "AboutPage",
    component: () => import("@/views/AboutView.vue"),
    meta: { isMenu: true, dark: true },
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/LoginView.vue"),
    meta: { isMenu: false, dark: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    component: ErrorView,
    hidden: true,
    meta: {
      requiresAuth: false,
      code: 404,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router