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
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
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
