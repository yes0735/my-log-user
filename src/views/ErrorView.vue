<template>
  <div
    class="flex justify-center items-center flex-auto h-full bg-gray-50 dark:bg-gray-900"
  >
    <div class="text-center p-8">
      <div class="mb-8">
        <Error class="w-28 h-28 mx-auto text-red-500 animate-bounce" />
      </div>
      <h1 class="H1-B text-gray-800 dark:text-gray-100 mb-4">
        {{ errorInfo.title }}
      </h1>
      <p
        class="Body1-M text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-line"
      >
        {{ errorInfo.description }}
      </p>
      <router-link
        to="/"
        class="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Error from "@/components/icons/Error.vue"

const ERROR_INFO = {
  403: {
    title: "페이지 접근 권한이 없습니다",
    description: `접속하신 계정으로는 해당 페이지 접근이 불가능합니다
관리자에게 문의해주세요`,
  },
  404: {
    title: "요청하신 페이지를 찾을 수 없습니다",
    description: `주소가 잘못 입력되었거나, 변경 또는 삭제되어 요청하신 페이지를 찾을 수 없습니다
지속적인 오류 발생 시, 관리자에게 문의해 주세요`,
  },
  503: {
    title: "서비스 이용이 불가능합니다",
    description: `잠시 서비스에 문제가 발생하여 페이지를 표시하지 못했습니다
조금 뒤에 다시 시도해주세요
지속적으로 문제가 발생하는 경우 관리자에게 문의해주세요`,
  },
}

const route = useRoute()

const errorInfo = computed(() => {
  const errorCode = route.meta?.code || 404
  return ERROR_INFO[errorCode] || ERROR_INFO[404]
})
</script>

<style>
/* 필요한 경우 커스텀 스타일 추가 */
</style>
