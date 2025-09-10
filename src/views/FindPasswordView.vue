<template>
  <div class="flex-1 flex items-center justify-center bg-[#f5f6f7] px-4">
    <div class="max-w-[460px] w-full">
      <!-- 헤더 -->
      <div class="text-center">
        <h2 class="text-[42px] font-bold text-black" id="find-password-title">비밀번호 찾기</h2>
      </div>

      <div v-if="foundAccounts.length == 0" class="mt-6 border border-[#dadada] rounded-[6px] p-6 bg-white">
        <h2 id="send-code-title" class="sr-only">인증번호 요청 폼</h2>
        <form 
          @submit.prevent="sendVerificationCode"
          aria-labelledby="send-code-title"
        >
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
              <p v-if="sendCodeErrorMsg" class="text-xs text-gray-400 mt-1 text-red-500">{{ sendCodeErrorMsg }}</p> <!-- 실패 메시지 -->
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
          @submit.prevent="verifyCode"
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
            <p v-if="verifyCodeErrorMsg" class="text-xs text-gray-400 mt-1 text-red-500">{{ verifyCodeErrorMsg }}</p> <!-- 실패 메시지 -->
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

      <h2 id="new-password-title" class="sr-only">비밀번호 변경</h2>
      <section v-if="foundAccounts.length" aria-labelledby="new-password-title" role="region">
        <div class="mt-6 border border-[#dadada] rounded-[6px] p-6 bg-white">
          <form 
            @submit.prevent="sendNewPassword"
            aria-labelledby="send-code-title"
          >
            <div class="space-y-3">
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
            </div>

            <!-- 비밀번호 변경 버튼 -->
            <div class="mt-4">
              <button
                type="submit"
                :disabled="!isPasswordFormValid || !isPasswordMatch"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-[6px] text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="비밀번호 변경"
              >
                비밀번호 변경
              </button>
            </div>
          </form>
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
import EyeOpenIcon from '@/components/icons/EyeOpenIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import axios from 'axios'


const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const visible = ref(false)
const visibleConfirm = ref(false)
const mobilePhoneNumber = ref('')
const verificationCode = ref('')
const codeInputRef = ref(null)
const codeSent = ref(false)
const foundAccounts = ref([])
const sendCodeErrorMsg = ref('')
const verifyCodeErrorMsg = ref('')

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

// 비밀번호 검증
const isPasswordMatch = computed(() => {
  return password.value && passwordConfirm.value && password.value === passwordConfirm.value
})

const passwordError = computed(() => {
  if (!passwordConfirm.value) return ''
  if (isPasswordMatch.value) return ''
  return '비밀번호가 일치하지 않습니다.'
})

// 인증번호 코드 형식 검증 (영문/숫자 상관없이 6자리 체크)
// const isValidCode = computed(() => /^[a-zA-Z0-9]{6}$/.test(verificationCode.value))
// 인증번호 코드 형식 검증 (숫자 6자리 체크)
const isValidCode = computed(() => /^\d{6}$/.test(verificationCode.value))


// 유효성 검사
const isFormValid = computed(() =>
  mobilePhoneNumber.value
)

// 유효성 검사
const isPasswordFormValid = computed(() =>
  password.value &&
  passwordConfirm.value
)
// 🔐 인증번호 전송
async function sendVerificationCode() {
  try {

    if (timer.value > 0) return // ✅ 이미 타이머가 돌고 있으면 차단
    sendCodeErrorMsg.value = ''

    // 인증번호 input, 에러 메세지 초기화 
    verificationCode.value = ""
    verifyCodeErrorMsg.value = ""

    // const response = await axios.post('/api/auth/send-code', {
    //   mobilePhoneNumber: mobilePhoneNumber.value
    // })

    // if (response.data.success) {
    //   codeSent.value = true
    //   timer.value = 180
    //   startTimer()
    // } else {
    //   sendCodeErrorMsg.value = response.data.message || '인증번호 전송 실패'
    // }

    // test 코드

    // 계정, 연락처가 없는경우
    // sendCodeErrorMsg.value = '입력하신 정보로 가입 된 회원은 존재하지 않습니다.'
    // 계정, 연락처가 있는경우
    codeSent.value = true
    timer.value = 5
    startTimer()

    // 인증코드 입력창에 포커스
    nextTick(() => {
      codeInputRef.value?.focus()
    })

  } catch (err) {
    sendCodeErrorMsg.value = '서버 오류가 발생했습니다.'
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
async function verifyCode() {
  try {
    verifyCodeErrorMsg.value = ''

    // ⛔ 인증번호 시간 초과 체크
    if (timer.value <= 0) {
      verifyCodeErrorMsg.value = '인증 시간이 초과되었습니다. 인증번호를 다시 요청해주세요.'
      return
    }

    // const res = await axios.post('/api/auth/verify-code', {
    //   mobilePhoneNumber: mobilePhoneNumber.value,
    //   code: verificationCode.value
    // })

    // if (res.data.success) {
    //   foundAccounts.value = res.data.ids
    // } else {
    //   verifyCodeErrorMsg.value = res.data.message || '인증번호가 올바르지 않습니다.'
    // }

    // test 코드
    // -- 인증 실패 
    verifyCodeErrorMsg.value = '인증번호가 올바르지 않습니다.'
    // foundAccounts.value = []
    // -- 인증 성공
    foundAccounts.value = [
      'slaqmtm11@gmail.com'
    ]
  } catch (e) {
    verifyCodeErrorMsg.value = '서버 오류가 발생했습니다.'
  }
}

// 비밀번호 변경 처리
async function sendNewPassword() {
  if (!isPasswordFormValid.value) return

  try {

    alert('비밀번호 변경이 완료되었습니다.')

    // const payloadJoin = {
    //   userMail: email.value,
    //   userPassword: password.value,
    //   userPasswordConfirm: passwordConfirm.value,
    //   userMobilePhoneNumber: mobilePhoneNumber.value,
    // }

    // const response = await userStore.userJoin(payloadJoin)

    // if (http.isOk(response)) {
    //   alert('회원가입이 완료되었습니다.')

    //   const payloadLogin = {
    //     loginId: email.value,
    //     loginPw: password.value,
    //   }

    //   await useAuth.login(payloadLogin)
    //   router.push('/')
    // } else {
    //   alert(http.getMessage(response))
    // }
  } catch (error) {
    console.error('회원가입 실패:', error)
  } finally {
  }
}

onUnmounted(() => clearInterval(intervalId))
</script>
