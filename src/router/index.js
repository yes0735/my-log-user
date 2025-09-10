import { createWebHistory, createRouter } from "vue-router"
import ErrorView from "@/views/ErrorView.vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
// import { ref } from "vue"
import { computed } from 'vue'

const routes = [
  {
    path: "/",
    name: "BookList",
    component: () => import("@/views/BookList.vue"),
    meta: { requiresAuth: true, isMenu: true, dark: true },
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
    path: "/find-account",
    name: "FindAccount",
    component: () => import("@/views/FindAccountView.vue"),
    meta: { requiresAuth: false, dark: true },
  },
  {
    path: "/find-password",
    name: "FindPassword",
    component: () => import("@/views/FindPasswordView.vue"),
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
    path: "/book/write",
    name: "WritePage",
    component: () => import("@/views/BookAddView.vue"),
    meta: { requiresAuth: true, isMenu: true, dark: true },
  },
  {
    path: "/bookCategory",
    name: "categoryList",
    component: () => import("@/views/BookAddView.vue"),
    meta: { requiresAuth: true, isMenu: true, dark: true },
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1. accessToken이 없으면 localStorage에서 복원 시도
  if (!authStore.user.accessToken) {
    authStore.restoreToken()
  }

  const accessToken = authStore.user.accessToken

  // 로그인 여부 확인
  const isLoginned = !!accessToken

  // 로그인 여부 확인 (로그인 필요한 페이지인 경우)
  if (!isLoginned && to.meta.requiresAuth) {
    // 엑세스 토큰 없음, 리프레시 토큰 갱신 시도
    const refresh_response = await authStore.refresh()
    if (refresh_response === true) {
      next()
    } else {
      next({
        path: "/login",
      })
    }
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
