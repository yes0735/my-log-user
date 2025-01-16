<template>
  <div class="flex items-center">
    <div
      v-for="n in 5"
      :key="n"
      class="relative star-container -ml-0.5 md:w-8 w-6"
    >
      <!-- 읽기 전용이 아닐 때만 버튼 표시 -->
      <template v-if="!readonly">
        <!-- 왼쪽 절반 (0.5) -->
        <button
          @click="setRating(n - 0.5)"
          @mouseover="hoverRating = n - 0.5"
          @mouseleave="hoverRating = 0"
          class="absolute left-0 w-1/2 h-full z-10 focus:outline-none"
        ></button>
        <!-- 오른쪽 절반 (1.0) -->
        <button
          @click="setRating(n)"
          @mouseover="hoverRating = n"
          @mouseleave="hoverRating = 0"
          class="absolute right-0 w-1/2 h-full z-10 focus:outline-none"
        ></button>
      </template>
      <!-- 별 아이콘 -->
      <div class="text-2xl transition-colors relative">
        <div class="relative">
          <!-- 빈 별 -->
          <span class="text-gray-300">★</span>
          <!-- 채워진 별 -->
          <div
            class="absolute inset-0 overflow-hidden text-yellow-400"
            :style="{
              width: getStarWidth(n),
            }"
          >
            ★
          </div>
        </div>
      </div>
    </div>
    <span v-if="showScore" class="ml-2 text-sm text-gray-500">
      {{ modelValue.toFixed(1) }}점
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  showScore: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["update:modelValue"])

const hoverRating = ref(0)

const setRating = (value) => {
  if (!props.readonly) {
    emit("update:modelValue", value)
  }
}

const getStarWidth = (position) => {
  const rating = hoverRating.value || props.modelValue
  const difference = rating - position + 1

  if (difference >= 1) return "100%"
  if (difference <= 0) return "0%"
  return `${difference * 100}%`
}
</script>

<style scoped>
.star-container {
  position: relative;
  height: 2em;
  display: inline-block;
}

@media (max-width: 768px) {
  .star-container {
    font-size: 0.875rem; /* 14px */
  }
}

.star-container > div {
  position: relative;
  display: inline-block;
}

.star-fill {
  top: 0;
  left: 0;
  white-space: nowrap;
  pointer-events: none;
}

.star-fill span {
  display: block;
  text-align: left;
}

.star-container span {
  line-height: 1;
  user-select: none;
}

/* hover 효과 (읽기 전용이 아닐 때만) */
.star-container:not(.readonly) button:hover ~ div {
  color: #fcd34d;
}
</style>
