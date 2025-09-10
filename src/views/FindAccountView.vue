<template>
  <div class="flex-1 flex items-center justify-center bg-[#f5f6f7] px-4">
    <div class="max-w-[460px] w-full">
      <!-- 헤더 -->
      <div class="text-center">
        <h2 class="text-[42px] font-bold text-black" id="find-account-title">계정 찾기</h2>
      </div>

      <div v-if="!userMail" class=" mt-6 border border-[#dadada] rounded-[6px] p-6 bg-white">
        <h2 id="send-code-title" class="sr-only">인증번호 요청 폼</h2>
        <form 
          @submit.prevent="verifyCode"
          aria-labelledby="send-code-title"
        >
          <div class="space-y-3">
            <div>
              <label for="mobilePhoneNumber" class="sr-only">핸드폰 번호</label>
              <input 
                id="mobilePhoneNumber" 
                :value="mobilePhoneNumber"
                @input="handlePhoneInput"
                type="tel"
                maxlength="13"
                required
                aria-label="핸드폰 번호 입력"
                aria-required="true"
                pattern="^010-\d{4}-\d{4}$"
                title="010-1234-1234 "
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="010-1234-5678"
              >
              <!-- <p class="text-xs text-gray-400 mt-1">숫자만 입력하세요.</p> -->
            </div>
          </div>

          <!-- 인증번호 요청 버튼 -->
          <div class="mt-4">
            <button
              type="submit"
              :disabled="!isFormValid || timer > 0"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-[6px] text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="인증번호 요청"
            >
              인증번호 요청
            </button>
          </div>
        </form>

        <h2 id="verify-code-title" class="sr-only">인증번호 확인 폼</h2>
        <form 
          @submit.prevent="verifyCodeConfirm"
          aria-labelledby="verify-code-title"
        >
          <div v-if="codeSent" class="space-y-2 pt-[10px]">
            <!-- <label class="block text-sm font-medium text-gray-700">인증번호</label> -->
            <label for="verificationCode" class="sr-only">인증번호</label>
            <input
              id="verificationCode"
              type="text"
              ref="codeInputRef"
              v-model="verificationCode"
              maxlength="6"
              placeholder="인증번호 6자리"
              class="w-full px-4 py-2 border rounded-md"
            />
            <p v-if="errorMsg" class="text-xs text-gray-400 mt-1 text-red-500">{{ errorMsg }}</p> <!-- 실패 메시지 -->
            <p class="text-sm text-gray-500">남은 시간: {{ timer }}초</p>

            <button
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-[6px] text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isValidCode"
            >
              인증 확인
            </button>
          </div>
        </form>
      </div>

      <h2 id="account-result-title" class="sr-only">계정 결과값</h2>
      <section v-if="userMail" aria-labelledby="account-result-title" role="region">
        <div class="mt-6 border border-[#dadada] rounded-[6px] p-6 bg-white">
          <!-- ✅ 계정 리스트 -->
          <div class="space-y-2 text-center">
            <ul class="space-y-2">
              <li
                class="text-xl font-semibold text-gray-900"
              >
                {{ userMail }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 로그인 링크 -->
      <nav class="text-center mt-4" aria-label="계정 관련 링크">
        <div class="space-x-2 text-sm text-[#888] ">
          <router-link 
            to="/login" 
            class="text-[#888] hover:text-black transition-colors duration-200 ease-in-out"
            aria-label="로그인"
          >
          로그인하러 가기
          </router-link>
        </div>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { useAuthStore } from "@/store/auth"
import { useHttp } from "@/api/http"

const mobilePhoneNumber = ref('')
const verificationCode = ref('')
const codeInputRef = ref(null)
const codeSent = ref(false)
// const foundAccounts = ref([])
const userMail = ref(null)
const errorMsg = ref('')
const http = useHttp()
const useAuth = useAuthStore()

const timer = ref(0)
let intervalId = null

// 핸드폰 형식 자동 하이픈
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

// 인증번호 코드 형식 검증 (영문/숫자 상관없이 6자리 체크)
// const isValidCode = computed(() => /^[a-zA-Z0-9]{6}$/.test(verificationCode.value))
// 인증번호 코드 형식 검증 (숫자 6자리 체크)
const isValidCode = computed(() => /^\d{6}$/.test(verificationCode.value))


// 유효성 검사
const isFormValid = computed(() =>
  mobilePhoneNumber.value
)
// 🔐 인증번호 전송
const verifyCode = async () => {
  try {
    
    if (timer.value > 0) return // ✅ 이미 타이머가 돌고 있으면 차단
    errorMsg.value = ''
    const payload = {
      phoneNumber: mobilePhoneNumber.value
    }
    
    const response = await useAuth.verifyCode(payload)

    if (http.isOk(response)) {
      codeSent.value = true
      timer.value = 180 // redis 
      startTimer()
    } else {
      alert(http.getMessage(response))
    }

    // 인증코드 입력창에 포커스
    nextTick(() => {
      codeInputRef.value?.focus()
    })

  } catch (err) {
    errorMsg.value = '서버 오류가 발생했습니다.'
  }
}

// ⏱️ 타이머 시작
function startTimer() {
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(intervalId)
    }
  }, 1000)
}

// 인증번호 확인 및 아이디 검색
async function verifyCodeConfirm() {
  try {
    errorMsg.value = ''

    // ⛔ 인증번호 시간 초과 체크
    if (timer.value <= 0) {
      errorMsg.value = '인증 시간이 초과되었습니다. 인증번호를 다시 요청해주세요.'
      return
    }

    const payload = {
      phoneNumber: mobilePhoneNumber.value,
      code: verificationCode.value
    }
    
    const response = await useAuth.verifyCodeConfirm(payload)

    if (http.isOk(response)) {
      userMail.value = response.result
    } else {
      errorMsg.value = '인증번호가 올바르지 않습니다.'
      // alert(http.getMessage(response))
    }

  } catch (e) {
    errorMsg.value = '서버 오류가 발생했습니다.'
  }
}

onUnmounted(() => clearInterval(intervalId))
</script>
