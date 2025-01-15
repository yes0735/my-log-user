<template>
  <svg
    :class="[
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.white,
    ]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: "sm",
  },
  color: {
    type: String,
    default: "white",
  },
})

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

const colorClasses = {
  white: "text-white",
  gray: "text-gray-400",
  black: "text-black",
}
</script>
