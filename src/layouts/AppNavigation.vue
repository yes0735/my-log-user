<template>
  <nav
    class="sticky top-0 bg-white z-50 transition-all duration-300"
    :class="{
      'translate-y-0': !isHidden || isMenuInteracting,
      '-translate-y-full':
        isHidden && isMobile && !isMenuInteracting && !isOpen,
      'shadow-lg': !isHidden || !isMobile,
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- 로고와 메뉴를 포함하는 왼쪽 영역 -->
        <div class="flex items-center space-x-8">
          <!-- 로고 -->
          <router-link to="/" class="flex-shrink-0 flex items-center space-x-2">
            <Logo />
            <span class="text-xl font-bold text-gray-800">NOTiON</span>
          </router-link>

          <!-- 데스크톱 메뉴 -->
          <div class="hidden md:flex items-center space-x-4">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              active-class="bg-gray-100 text-gray-900"
            >
              독서 기록
            </router-link>
            <!--
            <router-link
              to="/about"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              active-class="bg-gray-100 text-gray-900"
            >
              About
            </router-link>
            -->
            <!-- 드롭다운 메뉴 -->
             <!--
            <div class="relative group">
              <button
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 inline-flex items-center"
              >
                <span>Shop</span>
                <svg
                  class="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                class="absolute z-10 left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block before:content-[''] before:absolute before:w-full before:h-2 before:-top-2"
                style="top: calc(100% + 0.25rem)"
              >
                <div class="py-1">
                  <router-link
                    to="/2"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All Products
                  </router-link>
                  <router-link
                    to="/3"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Popular Items
                  </router-link>
                  <router-link
                    to="/4"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    New Arrivals
                  </router-link>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
  
        <!-- 오른쪽 영역 -->
        <div class="flex items-center">
          <!-- 데스크톱 로그인/유저 메뉴 -->
          <div class="hidden md:flex items-center">
            <template v-if="!isLoggedIn">
              <router-link
                to="/login"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Login
              </router-link>
            </template>
            <template v-else>
              <div class="flex items-center space-x-4">
                <router-link
                  to="/mypage"
                  class="block px-2 py-2 text-sm text-gray-700 hover:text-black"
                >
                  마이페이지
                </router-link>
                <button
                  @click="handleLogout"
                  class="text-left px-2 py-2 text-sm text-gray-700 hover:text-black"
                >
                  로그아웃
                </button>
              </div>
            </template>
          </div>

          <!-- 모바일 메뉴 버튼 -->
          <div class="flex md:hidden">
            <button
              @click="isOpen = !isOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                :class="{ hidden: isOpen, block: !isOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                class="h-6 w-6"
                :class="{ block: isOpen, hidden: !isOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 모바일 메뉴 패널 -->
    <div class="md:hidden" :class="{ block: isOpen, hidden: !isOpen }">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          active-class="bg-gray-100 text-gray-900"
        >
          독서 기록
        </router-link>

        <!--
        <router-link
          to="/about"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          active-class="bg-gray-100 text-gray-900"
        >
          About
        </router-link>

        
        <router-link
          to="/2"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Shop
        </router-link>
          -->
        <template v-if="!isLoggedIn">
          <router-link
            to="/login"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Login
          </router-link>
        </template>
        <template v-else>
          <router-link
            to="/mypage"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            마이페이지
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Logo from "@/components/icons/Logo.vue"
import { ref, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/store/auth"
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const isOpen = ref(false)
const isHidden = ref(false)
const hasScrolled = ref(false)
const isMobile = ref(false)
const isMenuInteracting = ref(false)
const lastScrollPosition = ref(0)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
const isLoggedIn = computed(() => !!user.value.accessToken)


// const isLoggedIn = ref(false) // 실제로는 store나 auth 상태에서 가져와야 함

// 메뉴 인터랙션 타이머
let menuInteractionTimer

const startMenuInteraction = () => {
  isMenuInteracting.value = true
  clearTimeout(menuInteractionTimer)
  menuInteractionTimer = setTimeout(() => {
    isMenuInteracting.value = false
  }, 1000) // 1초 후에 인터랙션 상태 해제
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md 브레이크포인트
}

const onScroll = () => {
  if (isMenuInteracting.value) return // 메뉴 인터랙션 중에는 스크롤 처리 무시

  const currentScrollPosition = window.scrollY
  hasScrolled.value = currentScrollPosition > 0

  if (isMobile.value) {
    if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 20) {
      return
    }
    isHidden.value =
      currentScrollPosition > lastScrollPosition.value &&
      currentScrollPosition > 100
  } else {
    isHidden.value = false
  }

  lastScrollPosition.value = currentScrollPosition
}

// 라우트 변경 감지하여 모바일 메뉴 닫기
watch(
  () => route.path,
  () => {
    isOpen.value = false
  }
)

const handleLogout = () => {
  // 로그아웃 처리
  authStore.logout()
  isLoggedIn.value = false
  router.push("/login")
}

onMounted(() => {
  window.addEventListener("scroll", onScroll)
  window.addEventListener("resize", checkMobile)

  // 모든 네비게이션 링크에 이벤트 리스너 추가
  const navLinks = document.querySelectorAll("nav a")
  navLinks.forEach((link) => {
    link.addEventListener("click", startMenuInteraction)
  })

  checkMobile()
  hasScrolled.value = window.scrollY > 0
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", checkMobile)
  clearTimeout(menuInteractionTimer)

  // 이벤트 리스너 제거
  const navLinks = document.querySelectorAll("nav a")
  navLinks.forEach((link) => {
    link.removeEventListener("click", startMenuInteraction)
  })
})
</script>
