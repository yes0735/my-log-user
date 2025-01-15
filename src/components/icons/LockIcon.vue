<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="[
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.white,
    ]"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: "md",
  },
  color: {
    type: String,
    default: "white",
  },
})

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

const colorClasses = {
  white: "text-white",
  gray: "text-gray-400",
  black: "text-black",
}
</script>
