<template>
  <AppNavigation />
  <main class="flex-auto flex flex-col w-full">
    <slot />
  </main>
  <AppFooter />
</template>

<script setup>
import AppNavigation from "@/layouts/AppNavigation.vue"
import AppFooter from "@/layouts/AppFooter.vue"
</script>
