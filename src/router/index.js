import { createWebHistory, createRouter } from "vue-router"
import ErrorView from "@/views/ErrorView.vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"

const routes = [
  {
    path: "/",
    name: "BookList",
    component: () => import("@/views/BookList.vue"),
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
    meta: { requiresAuth: false, dark: true },
  },
  {
    path: "/user/join",
    name: "UserJoinPage",
    component: () => import("@/views/UserJoinView.vue"),
    meta: { requiresAuth: false, dark: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error404",
    component: ErrorView,
    hidden: true,
    meta: {
      requiresAuth: false,
      code: 404,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error403",
    component: ErrorView,
    hidden: true,
    meta: {
      requiresAuth: false,
      code: 403,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  // 로그인 여부 확인
  const isLoginned = !!user.value?.accessToken

  // 로그인 여부 확인 (로그인 필요한 페이지인 경우)
  if (!isLoginned && to.meta.requiresAuth) {
    next({
      path: "/login",
    })
  } else {
    next()
  }
})

router.onError((error, to) => {
  // 모니터링용 에러 로그
  console.log(error)
  if (error.message.includes("Failed to fetch dynamically imported module")) {
    if (to?.fullPath) {
      window.location.href = to?.fullPath
    } else {
      window.location.reload()
    }
  }
})

export default router
