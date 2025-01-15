<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="[
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.gray,
    ]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  color: {
    type: String,
    default: "gray",
    validator: (value) => ["gray", "black", "white"].includes(value),
  },
})

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

const colorClasses = {
  gray: "text-gray-400",
  black: "text-black",
  white: "text-white",
}
</script>
