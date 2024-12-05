<template>
  <h1>home view 입니다 ^^</h1>
  <router-link to="/1">info</router-link>
</template>

<script>
export default {
  name: 'HomeView',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
