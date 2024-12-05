import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { isMenu: false, dark: true },
  },
  {
    path: "/1",
    name: "First Page",
    component: () => import("@/views/FirstView.vue"),
    meta: { isMenu: false, dark: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router