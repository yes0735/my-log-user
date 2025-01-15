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
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
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
