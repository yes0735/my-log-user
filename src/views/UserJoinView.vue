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

            <!-- 이름 입력 -->
            <div>
              <label for="first" class="sr-only">이름</label>
              <input 
                id="first" 
                v-model="first"
                type="text"
                required
                aria-label="이름 입력"
                aria-required="true"
                class="appearance-none relative block w-full px-4 py-3 border border-[#dadada] placeholder-[#929294] text-gray-900 rounded-[6px] sm:text-base hover:border-black focus:border-black focus:ring-0"
                placeholder="이름"
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
              :disabled="!isFormValid || loading"
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

<script>
import EyeOpenIcon from '@/components/icons/EyeOpenIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

export default {
  name: 'UserJoinView',
  components: {
    EyeOpenIcon,
    EyeClosedIcon,
    SpinnerIcon
  },
  data: () => ({
    first: '',
    email: '',
    password: '',
    terms: false,
    visible: false,
    loading: false
  }),
  computed: {
    isFormValid() {
      return this.first && this.email && this.password && this.terms
    }
  },
  methods: {
    async onSubmit() {
      if (!this.isFormValid || this.loading) return

      this.loading = true
      try {
        // TODO: 실제 회원가입 API 호출
        await new Promise(resolve => setTimeout(resolve, 1500)) // 임시 딜레이

        // 회원가입 성공 메시지
        alert('회원가입이 완료되었습니다.')

        // TODO: 실제 로그인 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이

        this.$router.push('/')
      } catch (error) {
        console.error('회원가입 실패:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
