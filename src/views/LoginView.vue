<template>
  <div class="flex-1 flex items-center justify-center bg-[#f5f6f7] px-4">
    <div class="max-w-[460px] w-full">
      <!-- 헤더 -->
      <div class="text-center">
        <h2 class="text-[42px] font-bold text-black" id="login-title">로그인</h2>
      </div>

      <!-- 로그인 폼 -->
      <form 
        class="mt-6" 
        @submit.prevent="handleSubmit"
        aria-labelledby="login-title"
      >
        <div class="border border-[#dadada] rounded-[6px] p-6 bg-white">
          <div class="space-y-3">
            <!-- 이메일 입력 -->
            <div>
              <label for="email" class="sr-only">이메일</label>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required
                aria-label="이메일 주소 입력"
                aria-required="true"
                aria-invalid="false"
                :aria-errormessage="emailError ? 'email-error' : undefined"
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                :class="{ 'border-red-300': emailError }"
                placeholder="이메일"
                @input="validateEmail"
              >
              <p 
                v-if="emailError" 
                id="email-error" 
                class="mt-1 text-sm text-red-600"
                role="alert"
              >
                {{ emailError }}
              </p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="relative">
              <label for="password" class="sr-only">비밀번호</label>
              <!-- <input 
                id="password" 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                aria-label="비밀번호 입력"
                aria-required="true"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
                title="비밀번호는 영문 대/소문자, 숫자, 특수문자(@$!%*?&#)를 각각 1개 이상 포함한 8자 이상이어야 합니다."
                class="appearance-none relative block w-full px-4 pr-12 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="비밀번호"
              > -->
              <input 
                id="password" 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                aria-label="비밀번호 입력"
                aria-required="true"
                title="비밀번호는 영문 대/소문자, 숫자, 특수문자(@$!%*?&#)를 각각 1개 이상 포함한 8자 이상이어야 합니다."
                class="appearance-none relative block w-full px-4 pr-12 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="비밀번호"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
                :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 표시'"
              >
                <EyeOpenIcon 
                  v-if="showPassword"
                  :color="showPassword ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
                <EyeClosedIcon 
                  v-else
                  :color="showPassword ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <!-- 추가 옵션 -->
          <div class="mt-3 flex items-center justify-between text-sm text-[#888]">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                aria-label="로그인 상태 유지"
              >
              <label for="remember-me" class="ml-2">
                로그인 상태 유지
              </label>
            </div>
          </div>

          <!-- 로그인 버튼 -->
          <div class="mt-4">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-[6px] text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="로그인"
              :aria-busy="loading"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <SpinnerIcon v-if="loading" aria-hidden="true" />
                <LockIcon v-else aria-hidden="true" />
              </span>
              {{ loading ? "로그인 중..." : "로그인" }}
            </button>
          </div>
        </div>
      </form>

      <!-- 회원가입 및 기타 링크 -->
      <nav class="text-center mt-4" aria-label="계정 관련 링크">
        <div class="space-x-2 text-sm">
          <router-link 
            to="/forgot-password" 
            class="text-[#888] hover:text-black transition-colors duration-200 ease-in-out"
            aria-label="비밀번호 찾기"
          >
            비밀번호 찾기
          </router-link>
          <span class="text-[#888]" aria-hidden="true">|</span>
          <router-link 
            to="/find-id" 
            class="text-[#888] hover:text-black transition-colors duration-200 ease-in-out"
            aria-label="아이디 찾기"
          >
            아이디 찾기
          </router-link>
          <span class="text-[#888]" aria-hidden="true">|</span>
          <router-link 
            to="/user/join" 
            class="text-[#888] hover:text-black transition-colors duration-200 ease-in-out"
            aria-label="회원가입"
          >
            회원가입
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EyeOpenIcon from '@/components/icons/EyeOpenIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import { useAuthStore } from "@/store/auth"

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const emailError = ref('')

const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.'
  } else if (!emailPattern.test(email.value)) {
    emailError.value = '올바른 이메일 형식이 아닙니다.'
  } else {
    emailError.value = ''
  }
}

const useAuth = useAuthStore()

const handleSubmit = async () => {
  if (loading.value) return

  validateEmail()
  if (emailError.value) return

  loading.value = true
  try {
    // TODO: 실제 로그인 로직 구현
    // await new Promise(resolve => setTimeout(resolve, 1500)) // 임시 딜레이

    const payload = {
      loginId: email.value,
      loginPw: password.value,
    }

    await useAuth.login(payload) // 액션 호출하여 데이터 가져오기
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
