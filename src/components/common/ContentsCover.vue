<template>
  <div
    class="relative group w-full h-[30vh] overflow-hidden"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 기본 커버 -->
    <div
      ref="coverRef"
      class="w-full h-full transition-all duration-300 cursor-move"
      :class="{ 'group-hover:scale-105': !isPositioning }"
      :style="{
        cursor: isPositioning ? 'move' : 'default',
        backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2580&q=80')`,
        backgroundPosition: `${50 + positionX / 2}% ${50 + positionY / 2}%`,
        backgroundRepeat: 'no-repeat',
      }"
      @mousedown="startDrag"
    ></div>

    <!-- 호버 시 나타나는 오버레이 -->
    <div
      class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-10"
      :style="{ pointerEvents: isPositioning ? 'none' : 'auto' }"
    >
      <div class="relative mx-auto h-full max-w-7xl px-4 lg:px-5">
        <div class="absolute top-5 right-5" :style="{ pointerEvents: 'auto' }">
          <a-space v-if="!isPositioning">
            <a-button
              type="primary"
              class="transition-all duration-300 bg-white !text-gray-800 hover:!text-gray-900"
              :style="{
                opacity: isHovered ? 1 : 0,
              }"
            >
              커버 변경
            </a-button>
            <a-button
              type="primary"
              class="transition-all duration-300 bg-white !text-gray-800 hover:!text-gray-900"
              :style="{
                opacity: isHovered ? 1 : 0,
              }"
              @click="startPositioning"
            >
              위치 변경
            </a-button>
          </a-space>

          <!-- 위치 변경 모드 버튼 -->
          <a-space v-else>
            <a-button
              type="primary"
              class="bg-white !text-gray-800 hover:!text-gray-900"
              @click="savePosition"
            >
              저장
            </a-button>
            <a-button
              class="!text-gray-800 hover:!text-gray-900"
              @click="cancelPositioning"
            >
              취소
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const isHovered = ref(false)
const isPositioning = ref(false)
const positionY = ref(0)
const positionX = ref(0)
const initialPositionY = ref(0)
const initialPositionX = ref(0)
const isDragging = ref(false)
const startY = ref(0)
const startX = ref(0)
const coverRef = ref(null)

const startDrag = (e) => {
  if (!isPositioning.value) return
  isDragging.value = true
  startY.value = e.clientY - positionY.value
  startX.value = e.clientX - positionX.value
  onDrag(e)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  const newY = e.clientY - startY.value
  const newX = e.clientX - startX.value
  positionY.value = Math.max(-100, Math.min(100, newY))
  positionX.value = Math.max(-100, Math.min(100, newX))
}

const stopDrag = () => {
  isDragging.value = false
}

// window에 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener("mousemove", onDrag)
  window.addEventListener("mouseup", stopDrag)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener("mousemove", onDrag)
  window.removeEventListener("mouseup", stopDrag)
})

const startPositioning = () => {
  isPositioning.value = true
  initialPositionY.value = positionY.value
  initialPositionX.value = positionX.value
}

const savePosition = () => {
  isPositioning.value = false
  // TODO: 위치 저장 API 호출
}

const cancelPositioning = () => {
  positionY.value = initialPositionY.value
  positionX.value = initialPositionX.value
  isPositioning.value = false
}
</script>

<style scoped>
.group:hover .a-button {
  opacity: 1 !important;
}

.a-button {
  opacity: 0 !important;
}

.cursor-move {
  user-select: none;
}
</style>
