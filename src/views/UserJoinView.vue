<template>
  <div class="flex-1 flex items-center justify-center bg-[#f5f6f7] px-4">
    <div class="max-w-[460px] w-full">
      <!-- 헤더 -->
      <div class="text-center">
        <h2 class="text-[42px] font-bold text-black" id="join-title">회원가입</h2>
      </div>

      <!-- 회원가입 폼 -->
      <form class="mt-6" @submit.prevent="onSubmit" aria-labelledby="join-title">
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
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="이메일"
              >
            </div>

            <!-- 비밀번호 입력 -->
            <div class="relative">
              <label for="password" class="sr-only">비밀번호</label>
              <input 
                id="password" 
                v-model="password"
                :type="visible ? 'text' : 'password'"
                required
                aria-label="비밀번호 입력"
                aria-required="true"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
                title="비밀번호는 영문 대/소문자, 숫자, 특수문자(@$!%*?&#)를 각각 1개 이상 포함한 8자 이상이어야 합니다."
                class="appearance-none relative block w-full px-4 pr-12 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="비밀번호"
              >
              <button 
                type="button"
                @click="visible = !visible"
                class="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
                :aria-label="visible ? '비밀번호 숨기기' : '비밀번호 표시'"
              >
                <EyeOpenIcon 
                  v-if="visible"
                  :color="visible ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
                <EyeClosedIcon 
                  v-else
                  :color="visible ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
              </button>
            </div>

            <!-- 비밀번호 재입력 -->
            <div class="relative">
              <label for="passwordConfirm" class="sr-only">비밀번호</label>
              <input 
                id="passwordConfirm" 
                v-model="passwordConfirm"
                :type="visibleConfirm ? 'text' : 'password'"
                required
                aria-label="비밀번호 재입력"
                aria-required="true"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
                title="비밀번호는 영문 대/소문자, 숫자, 특수문자(@$!%*?&#)를 각각 1개 이상 포함한 8자 이상이어야 합니다."
                class="appearance-none relative block w-full px-4 pr-12 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="비밀번호 재입력"
              >
              <button 
                type="button"
                @click="visibleConfirm = !visibleConfirm"
                class="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
                :aria-label="visibleConfirm ? '비밀번호 숨기기' : '비밀번호 표시'"
              >
                <EyeOpenIcon 
                  v-if="visibleConfirm"
                  :color="visibleConfirm ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
                <EyeClosedIcon 
                  v-else
                  :color="visibleConfirm ? 'black' : 'gray'"
                  class="pointer-events-none"
                  aria-hidden="true"
                />
              </button>
            </div>
            <p v-if="passwordError" class="text-sm text-red-500 mt-1">
              {{ passwordError }}
            </p>

            <!-- 핸드폰번호 입력 -->
            <div>
              <label for="mobilePhoneNumber" class="sr-only">핸드폰번호</label>
              <input 
                id="mobilePhoneNumber" 
                :value="mobilePhoneNumber"
                @input="handlePhoneInput"
                type="tel"
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                title="010-1234-5678"
                maxlength="13"
                required
                aria-label="핸드폰번호 입력"
                aria-required="true"
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="010-1234-5678"
              >
            </div>

            <!-- 닉네임 입력 -->
            <div>
              <label for="nickname" class="sr-only">닉네임</label>
              <input 
                id="nickname" 
                v-model="nickname"
                type="text"
                required
                aria-label="닉네임 입력"
                aria-required="true"
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="닉네임"
              >
            </div>

            <!-- 약관 동의 -->
            <div class="mt-3">
              <div class="flex items-center">
                <input 
                  id="terms" 
                  v-model="terms"
                  type="checkbox"
                  required
                  class="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  aria-label="이용약관 동의"
                >
                <label for="terms" class="ml-2 text-sm text-[#888]">
                  이용약관 동의
                </label>
              </div>
            </div>
          </div>

          <!-- 회원가입 버튼 -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="!isFormValid || loading || !isPasswordMatch"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-[6px] text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="회원가입"
              :aria-busy="loading"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <SpinnerIcon v-if="loading" aria-hidden="true" />
              </span>
              {{ loading ? "회원가입 중..." : "회원가입" }}
            </button>
          </div>
        </div>
      </form>

      <!-- 로그인 링크 -->
      <nav class="text-center mt-4" aria-label="계정 관련 링크">
        <div class="space-x-2 text-sm">
          <router-link 
            to="/login" 
            class="text-[#888] hover:text-black transition-colors duration-200 ease-in-out"
            aria-label="로그인"
          >
            이미 계정이 있으신가요? 로그인
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EyeOpenIcon from '@/components/icons/EyeOpenIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
import { useUser } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { useHttp } from '@/api/http'

const router = useRouter()
const userStore = useUser()
const useAuth = useAuthStore()
const http = useHttp()

// state
const nickname = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const mobilePhoneNumber = ref('')
const terms = ref(false)
const visible = ref(false)
const visibleConfirm = ref(false)
const loading = ref(false)

// 전화번호 하이픈 처리
function handlePhoneInput(event) {
  const raw = event.target.value.replace(/[^0-9]/g, '')
  if (raw.length <= 3) {
    mobilePhoneNumber.value = raw
  } else if (raw.length <= 7) {
    mobilePhoneNumber.value = `${raw.slice(0, 3)}-${raw.slice(3)}`
  } else {
    mobilePhoneNumber.value = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`
  }
}

// 유효성 검사
const isFormValid = computed(() =>
  nickname.value &&
  email.value &&
  password.value &&
  passwordConfirm.value &&
  mobilePhoneNumber.value &&
  terms.value
)

// 비밀번호 검증
const isPasswordMatch = computed(() => {
  return password.value && passwordConfirm.value && password.value === passwordConfirm.value
})

const passwordError = computed(() => {
  if (!passwordConfirm.value) return ''
  if (isPasswordMatch.value) return ''
  return '비밀번호가 일치하지 않습니다.'
})

// 회원가입 처리
async function onSubmit() {
  if (!isFormValid.value || loading.value) return

  loading.value = true
  try {
    const payloadJoin = {
      userMail: email.value,
      userPassword: password.value,
      userPasswordConfirm: passwordConfirm.value,
      userNickname: nickname.value,
      userMobilePhoneNumber: mobilePhoneNumber.value,
    }

    const response = await userStore.userJoin(payloadJoin)

    if (http.isOk(response)) {
      alert('회원가입이 완료되었습니다.')

      const payloadLogin = {
        loginId: email.value,
        loginPw: password.value,
      }

      await useAuth.login(payloadLogin)
      router.push('/')
    } else {
      alert(http.getMessage(response))
    }
  } catch (error) {
    console.error('회원가입 실패:', error)
  } finally {
    loading.value = false
  }
}
</script>