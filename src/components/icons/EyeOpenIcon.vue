<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="[
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.gray,
    ]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
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
    default: "gray",
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
