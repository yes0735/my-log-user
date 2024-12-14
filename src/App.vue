<template>
  <a-config-provider :theme="theme">
    <component :is="layout">
      <router-view></router-view>
    </component>
  </a-config-provider>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || DefaultLayout
})

// Ant Design 테마 설정
const theme = {}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
/* Select 컴포넌트 선택된 항목 좌측 정렬 */
.ant-select-selection-item {
  text-align: left !important;
}
</style>
