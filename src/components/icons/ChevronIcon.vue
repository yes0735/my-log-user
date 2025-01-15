<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="[
      'transition-transform duration-200',
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.gray,
      { 'rotate-180': isOpen },
    ]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
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
  isOpen: {
    type: Boolean,
    default: false,
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
