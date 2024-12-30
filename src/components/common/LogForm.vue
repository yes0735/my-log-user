<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="closeForm"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full md:h-[96vh] md:w-[800px] bg-white md:rounded-lg shadow-xl flex flex-col"
      >
        <!-- 헤더 -->
        <div
          class="flex items-center justify-between p-4 md:py-6 md:px-4 shrink-0"
        >
          <div
            ref="titleRef"
            class="H1-B outline-none min-w-[100px] title-placeholder"
            contenteditable="true"
            data-placeholder="새 페이지"
            @input="handleTitleInput"
            @keydown.enter="handleTitleEnter"
          ></div>
        </div>

        <!-- 에디터 영역 - 스크롤 가능하도록 수정 -->
        <div class="p-4 flex-1 overflow-y-auto">
          <div class="editor-container">
            <draggable
              v-model="blocks"
              item-key="id"
              handle=".drag-handle"
              :animation="150"
              @start="dragStart"
              @end="dragEnd"
            >
              <template #item="{ element, index }">
                <div class="block-wrapper relative hover:bg-gray-50/50">
                  <!-- 드래그 핸들 -->
                  <div
                    class="drag-handle absolute left-0 top-0 transition-opacity flex items-center gap-1 select-none z-10 cursor-move touch-manipulation"
                  >
                    <Drag class="text-gray-400 w-6 h-6" />
                  </div>

                  <!-- 블록 컨텐츠 -->
                  <div
                    :ref="(el) => (blockRefs[index] = el)"
                    contenteditable="true"
                    class="min-h-[24px] p-1 empty-block w-full focus:outline-none"
                    data-placeholder="내용을 입력하세요"
                    @keydown="(e) => onKeyDown(e, index)"
                    @input="(e) => onInput(e, index)"
                    @compositionend="(e) => handleCompositionEnd(e, index)"
                  >
                    {{ element.content }}
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>

        <!-- 하단 버튼 영역 -->
        <div class="flex justify-end gap-2 p-4 border-t shrink-0">
          <button
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            @click="closeForm"
          >
            취소
          </button>
          <button
            class="px-4 py-2 bg-black text-white hover:bg-black/80 rounded-md transition-colors"
            @click="saveContent"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from "vue"
import { useScrollLock } from "@/composables/useScrollLock"
import Drag from "@/components/icons/Drag.vue"
import draggable from "vuedraggable"
import { useEditorInput } from "@/composables/useEditorInput"

const props = defineProps({
  isNew: Boolean,
  modelValue: Boolean,
})

const emit = defineEmits(["update:modelValue"])

const titleRef = ref(null)
const title = ref("")
const blocks = ref([
  { id: 1, content: "" },
  { id: 2, content: "" },
])
const blockRefs = ref([])
const isDragging = ref(false)

// 스크롤 잠금 훅 사용
const { lock, unlock } = useScrollLock()

const { handleKeyDown, handleBlockInput } = useEditorInput()

// blocks 상태 업데이트 함수
const updateBlocks = (newBlocks) => {
  blocks.value = newBlocks
}

// 드래그 시작
const dragStart = () => {
  isDragging.value = true
}

// 드래그 종료
const dragEnd = () => {
  isDragging.value = false
}

// 초기화 함수 수정
const resetForm = () => {
  title.value = ""
  blocks.value = [{ id: 1, content: "" }]
  if (titleRef.value) {
    titleRef.value.textContent = ""
  }
}

// modelValue 변경 감지
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      lock()
    } else {
      unlock()
      if (props.isNew) {
        resetForm()
      }
    }
  },
  { immediate: true }
)

// 컴포넌트 언마운트 시 스크롤 복구
onBeforeUnmount(() => {
  unlock()
})

const handleTitleInput = (e) => {
  title.value = e.target.textContent.trim()
}

// 템플릿에서 이벤트 핸들러 사용 시
const onKeyDown = (e, index) =>
  handleKeyDown(e, index, blocks.value, blockRefs, updateBlocks)
const onInput = (e, index) =>
  handleBlockInput(e, index, blocks.value, updateBlocks)

const closeForm = () => {
  emit("update:modelValue", false)
}

// 저장 버튼 클릭 시 실행
const saveContent = () => {
  alert("저장되었습니다.")
  closeForm()
}

const handleTitleEnter = (e) => {
  e.preventDefault()
  // IME 입력 중인지 확인
  if (e.isComposing) return false

  blockRefs.value[0].focus()
}

// compositionend 이벤트 핸들러 수정
const handleCompositionEnd = (e, index) => {
  nextTick(() => {
    blocks.value[index].content = e.target.textContent
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}

[contenteditable="true"]:focus {
  outline: none;
}

/* 제목 입력 시 스타일 */
[contenteditable="true"] {
  transition: border-color 0.2s ease;
}

[contenteditable="true"]:hover {
  cursor: text;
}

[contenteditable="true"]:focus {
  outline: none;
}

/* placeholder 스타일 수정 */
.placeholder:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.title-placeholder:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  cursor: text;
}

.empty-block:empty:not(:focus):before {
  content: "";
}

.empty-block:empty:focus:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  cursor: text;
}

.editor-container {
  min-height: 100%;
}

.block-wrapper {
  display: flex;
  position: relative;
  padding-left: 24px;
}

.block-wrapper,
.block-wrapper > div {
  transition: opacity 0.15s ease-in-out;
}

/* WebKit 브라우저의 기본 포커스 링 제거 */
[contenteditable] {
  -webkit-tap-highlight-color: transparent;
}

.drag-handle {
  opacity: 0;
  cursor: move;
  touch-action: none; /* 모바일에서 더 나은 드래그 경험을 위해 */
}

.block-wrapper:hover .drag-handle {
  opacity: 1;
}

/* 드래그 중인 아이템 스타일 */
.sortable-ghost {
  opacity: 0.5;
  background: #f3f4f6;
}

.sortable-drag {
  opacity: 0.9;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-block {
  white-space: pre-wrap !important; /* 줄바꿈 강제 적용 */
  word-break: break-word;
  min-height: 24px;
  padding: 1px;
  width: 100%;
  display: block; /* block 레벨 요소로 설정 */
}

[contenteditable="true"] {
  white-space: pre-wrap !important; /* contenteditable 요소에도 적용 */
}
</style>
