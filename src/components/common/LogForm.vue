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
          <div class="editor-container space-y-4">
            <!-- 기본 항목들 -->
            <div class="space-y-2 pb-6 border-b border-gray-200">
              <!-- 1. 저자 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">저자</label>
                </div>
                <input
                  type="text"
                  v-model="bookInfo.author"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 2. 분야 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="select" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">분야</label>
                </div>
                <div class="flex-1 relative">
                  <button
                    type="button"
                    @click="toggleDropdown('category')"
                    class="w-full px-3 py-2 text-left text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white flex justify-between items-center"
                  >
                    <span class="text-gray-700">
                      {{ getSelectedLabel("category", categoryOptions) }}
                    </span>
                    <ChevronIcon :is-open="openDropdown === 'category'" />
                  </button>

                  <div
                    v-if="openDropdown === 'category'"
                    class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
                  >
                    <div class="p-2 border-b">
                      <div class="relative">
                        <input
                          type="text"
                          v-model="searchQueries.category"
                          class="w-full px-3 py-1.5 pr-8 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          placeholder="검색..."
                          @click.stop
                        />
                        <span
                          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <SearchIcon size="sm" />
                        </span>
                      </div>
                    </div>

                    <div class="py-1 max-h-48 overflow-auto">
                      <template v-if="filteredCategoryOptions.length">
                        <button
                          v-for="option in filteredCategoryOptions"
                          :key="option.value"
                          @click="selectOption('category', option.value)"
                          class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
                          :class="{
                            'bg-gray-50': bookInfo.category === option.value,
                            'font-medium': bookInfo.category === option.value,
                          }"
                        >
                          {{ option.label }}
                        </button>
                      </template>
                      <div v-else class="px-3 py-2 text-sm text-gray-500">
                        검색 결과가 없습니다
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. 별점 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <StarIcon size="sm" />
                  <label class="text-sm font-medium text-gray-700">별점</label>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-1">
                    <button
                      v-for="n in 5"
                      :key="n"
                      @click="bookInfo.rating = n"
                      class="text-2xl focus:outline-none transition-colors"
                      :class="
                        n <= bookInfo.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      "
                    >
                      ★
                    </button>
                    <span class="ml-2 text-sm text-gray-500">
                      {{ `${bookInfo.rating}점` }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 4. 독서유형 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="select" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >독서유형</label
                  >
                </div>
                <div class="flex-1 relative">
                  <button
                    type="button"
                    @click="toggleDropdown('readingType')"
                    class="w-full px-3 py-2 text-left text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white flex justify-between items-center"
                  >
                    <span class="text-gray-700">
                      {{ getSelectedLabel("readingType", readingTypeOptions) }}
                    </span>
                    <ChevronIcon :is-open="openDropdown === 'readingType'" />
                  </button>

                  <div
                    v-if="openDropdown === 'readingType'"
                    class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
                  >
                    <div class="py-1">
                      <button
                        v-for="option in readingTypeOptions"
                        :key="option.value"
                        @click="selectOption('readingType', option.value)"
                        class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
                        :class="{
                          'bg-gray-50': bookInfo.readingType === option.value,
                          'font-medium': bookInfo.readingType === option.value,
                        }"
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. 상태 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="select" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">상태</label>
                </div>
                <div class="flex-1 relative">
                  <button
                    type="button"
                    @click="toggleDropdown('status')"
                    class="w-full px-3 py-2 text-left text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white flex justify-between items-center"
                  >
                    <span class="text-gray-700">
                      {{ getSelectedLabel("status", statusOptions) }}
                    </span>
                    <ChevronIcon :is-open="openDropdown === 'status'" />
                  </button>

                  <div
                    v-if="openDropdown === 'status'"
                    class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
                  >
                    <div class="py-1">
                      <button
                        v-for="option in statusOptions"
                        :key="option.value"
                        @click="selectOption('status', option.value)"
                        class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
                        :class="{
                          'bg-gray-50': bookInfo.status === option.value,
                          'font-medium': bookInfo.status === option.value,
                        }"
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 6. 출판사 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >출판사</label
                  >
                </div>
                <input
                  type="text"
                  v-model="bookInfo.publisher"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 7. 연도 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">연도</label>
                </div>
                <input
                  type="number"
                  v-model="bookInfo.publishYear"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 8. 날짜 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="date" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">날짜</label>
                </div>
                <input
                  type="date"
                  v-model="bookInfo.readDate"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 9. 장소 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">장소</label>
                </div>
                <input
                  type="text"
                  v-model="bookInfo.location"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 10. 이 책의 한 줄 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >이 책의 한 줄</label
                  >
                </div>
                <input
                  type="text"
                  v-model="bookInfo.bookSummary"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 11. 나의 생각 한줄 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >나의 생각 한줄</label
                  >
                </div>
                <input
                  type="text"
                  v-model="bookInfo.myThoughts"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 12. 커버 이미지 첨부 -->
              <div class="form-group flex items-start py-2">
                <div class="flex items-center gap-2 w-32 pt-2">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >커버 이미지</label
                  >
                </div>
                <div class="flex-1 flex items-start gap-4">
                  <!-- 이미지 미리보기 -->
                  <div
                    v-if="imagePreview"
                    class="relative w-16 h-20 shrink-0 z-10"
                  >
                    <img
                      :src="imagePreview"
                      class="w-full h-full object-cover rounded-md border border-gray-200"
                      alt="Cover preview"
                    />
                    <button
                      @click="removeImage"
                      class="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
                    >
                      <CloseIcon size="sm" />
                    </button>
                  </div>

                  <!-- 파일 입력 -->
                  <div class="flex-1">
                    <label
                      class="inline-flex w-full items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <ImageIcon class="mr-2" />
                      {{ imagePreview ? "이미지 변경" : "이미지 선택" }}
                      <input
                        type="file"
                        @change="handleImageUpload"
                        accept="image/*"
                        class="hidden"
                      />
                    </label>
                    <p class="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF 파일 (최대 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <!-- 13. Page Read -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >Page Read</label
                  >
                </div>
                <input
                  type="number"
                  v-model="bookInfo.currentPage"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 14. Total Page -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >Total Page</label
                  >
                </div>
                <input
                  type="number"
                  v-model="bookInfo.totalPages"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 15. 영업 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700">영업</label>
                </div>
                <input
                  type="text"
                  v-model="bookInfo.sales"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <!-- 16. 읽는 과정 -->
              <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                  <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                  <label class="text-sm font-medium text-gray-700"
                    >읽는 과정</label
                  >
                </div>
                <input
                  type="text"
                  v-model="bookInfo.readingProcess"
                  class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
            </div>
            <!-- 블록 에디터 -->
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
import {
  ref,
  watch,
  onBeforeUnmount,
  nextTick,
  onMounted,
  onUnmounted,
  computed,
  reactive,
} from "vue"
import { useScrollLock } from "@/composables/useScrollLock"
import Drag from "@/components/icons/Drag.vue"
import draggable from "vuedraggable"
import { useEditorInput } from "@/composables/useEditorInput"
import InputIcons from "@/components/icons/InputIcons.vue"
import ChevronIcon from "@/components/icons/ChevronIcon.vue"
import SearchIcon from "@/components/icons/SearchIcon.vue"
import StarIcon from "@/components/icons/StarIcon.vue"
import CloseIcon from "@/components/icons/CloseIcon.vue"
import ImageIcon from "@/components/icons/ImageIcon.vue"

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

const bookInfo = reactive({
  author: "",
  category: "",
  rating: 0,
  readingType: "paper",
  status: "reading",
  publisher: "",
  publishYear: new Date().getFullYear(),
  readDate: new Date().toISOString().split("T")[0],
  currentPage: 0,
  totalPages: 0,
  bookSummary: "",
  myThoughts: "",
  coverImage: null,
})

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
  bookInfo.author = ""
  bookInfo.category = ""
  bookInfo.rating = 0
  bookInfo.readingType = "paper"
  bookInfo.status = "reading"
  bookInfo.publisher = ""
  bookInfo.publishYear = new Date().getFullYear()
  bookInfo.readDate = new Date().toISOString().split("T")[0]
  bookInfo.currentPage = 0
  bookInfo.totalPages = 0
  bookInfo.bookSummary = ""
  bookInfo.myThoughts = ""
  bookInfo.coverImage = null
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
  const formData = {
    title: title.value,
    blocks: blocks.value,
    bookInfo: bookInfo,
  }

  console.log("저장될 데이터:", formData)
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

// 텍스트 입력 필드 정의
const textFields = [
  { key: "author", label: "저자" },
  { key: "publisher", label: "출판사" },
  { key: "bookSummary", label: "이 책의 한 줄" },
  { key: "myThoughts", label: "나의 생각 한줄" },
]

// Select 입력 필드 정의
const selectFields = [
  {
    key: "category",
    label: "분야",
    options: [
      { value: "", label: "선택하세요" },
      { value: "novel", label: "소설" },
      { value: "essay", label: "에세이" },
      { value: "poetry", label: "시" },
      { value: "business", label: "경영/경제" },
      { value: "self_improvement", label: "자기계발" },
      { value: "psychology", label: "심리학" },
      { value: "philosophy", label: "철학" },
      { value: "history", label: "역사" },
      { value: "science", label: "과학" },
      { value: "technology", label: "IT/기술" },
      { value: "art", label: "예술" },
      { value: "humanities", label: "인문학" },
      { value: "social_science", label: "사회과학" },
      { value: "politics", label: "정치/사회" },
      { value: "religion", label: "종교" },
      { value: "health", label: "건강/의학" },
      { value: "travel", label: "여행" },
      { value: "cooking", label: "요리" },
      { value: "education", label: "교육" },
    ],
  },
  {
    key: "readingType",
    label: "독서유형",
    options: [
      { value: "paper", label: "종이책" },
      { value: "ebook", label: "전자책" },
      { value: "audio", label: "오디오북" },
    ],
  },
  {
    key: "status",
    label: "상태",
    options: [
      { value: "reading", label: "읽는 중" },
      { value: "completed", label: "완독" },
      { value: "paused", label: "잠시 멈춤" },
    ],
  },
]

// 숫자 입력 필드 추가
const numberFields = [
  { key: "currentPage", label: "현재 페이지" },
  { key: "totalPages", label: "전체 페이지" },
  { key: "publishYear", label: "출판연도" },
]

const openDropdown = ref(null)
const searchQueries = ref({
  category: "",
  readingType: "",
  status: "",
})

// 옵션 데이터
const categoryOptions = [
  { value: "", label: "선택하세요" },
  { value: "novel", label: "소설" },
  { value: "essay", label: "에세이" },
  { value: "poetry", label: "시" },
  { value: "business", label: "경영/경제" },
  { value: "self_improvement", label: "자기계발" },
  { value: "psychology", label: "심리학" },
  { value: "philosophy", label: "철학" },
  { value: "history", label: "역사" },
  { value: "science", label: "과학" },
  { value: "technology", label: "IT/기술" },
  { value: "art", label: "예술" },
  { value: "humanities", label: "인문학" },
  { value: "social_science", label: "사회과학" },
  { value: "politics", label: "정치/사회" },
  { value: "religion", label: "종교" },
  { value: "health", label: "건강/의학" },
  { value: "travel", label: "여행" },
  { value: "cooking", label: "요리" },
  { value: "education", label: "교육" },
]

const readingTypeOptions = [
  { value: "paper", label: "종이책" },
  { value: "ebook", label: "전자책" },
  { value: "audio", label: "오디오북" },
]

const statusOptions = [
  { value: "reading", label: "읽는 중" },
  { value: "completed", label: "완독" },
  { value: "paused", label: "잠시 멈춤" },
]

// 필터링된 분야 옵션만 유지
const filteredCategoryOptions = computed(() => {
  const query = searchQueries.value.category?.toLowerCase() || ""
  return categoryOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
  )
})

// 드롭다운 토글
const toggleDropdown = (key) => {
  if (openDropdown.value === key) {
    openDropdown.value = null
    searchQueries.value[key] = ""
  } else {
    openDropdown.value = key
    searchQueries.value[key] = ""
  }
}

// 옵션 선택
const selectOption = (key, value) => {
  bookInfo[key] = value
  openDropdown.value = null
  searchQueries.value[key] = ""
}

// 선택된 옵션 라벨 가져오기
const getSelectedLabel = (key, options) => {
  const option = options.find((opt) => opt.value === bookInfo[key])
  return option ? option.label : "선택하세요"
}

// 외부 클릭 시 드롭다운 닫기
onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

const handleClickOutside = (event) => {
  if (openDropdown.value && !event.target.closest(".form-group")) {
    openDropdown.value = null
    Object.keys(searchQueries.value).forEach((key) => {
      searchQueries.value[key] = ""
    })
  }
}

const imagePreview = ref(null)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 파일 크기 체크 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("파일 크기는 2MB를 초과할 수 없습니다.")
    event.target.value = ""
    return
  }

  // 이미지 미리보기 생성
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    // 여기에 실제 이미지 업로드 로직 추가
    bookInfo.coverImage = file
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  bookInfo.coverImage = null
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

.form-group {
  @apply mb-2 min-h-[2.25rem]; /* 최소 높이 설정 */
}

input,
select {
  @apply text-sm h-9; /* 높이 통일 */
}

/* 날짜 입력 필드의 기본 아이콘 숨기기 */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.3;
  cursor: pointer;
}

/* select 화살표 스타일링 */
select {
  background-image: none;
}

/* 라벨과 아이콘 정렬 */
.form-group label {
  @apply flex-shrink-0;
}

/* 드롭다운 스타일 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 스크롤바 스타일링 */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #edf2f7;
}

.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #edf2f7;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

/* 드롭다운 검색 입력 필드 스타일 */
.dropdown-search:focus {
  box-shadow: none;
}

input[type="text"],
input[type="number"],
input[type="date"] {
  @apply text-sm h-9 min-w-0; /* min-width 추가로 입력 필드가 너무 작아지는 것 방지 */
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
}

/* 이미지 미리보기 애니메이션 */
.image-preview-enter-active,
.image-preview-leave-active {
  transition: all 0.3s ease;
}

.image-preview-enter-from,
.image-preview-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 이미지 미리보기 컨테이너 스타일 */
.image-preview-container {
  @apply relative inline-block;
}

/* 별점 버튼 호버 효과 */
button:focus {
  outline: none;
}

/* 별점 애니메이션 */
.text-yellow-400 {
  transition: color 0.2s ease;
}
</style>
