
<template>
  <div class="w-full mx-auto pb-10 bg-white z-40">
    <div class="sticky top-16 w-full max-w-7xl mx-auto px-3 lg:px-4 border-b bg-white z-40 flex items-center justify-between">
        <!-- <div class="text-lg font-semibold text-gray-800">
            독서 기록 작성
        </div> -->

        <!-- 왼쪽: 책 추가 버튼 -->
        <div>
            <button
            class="inline-flex items-center px-3 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
            @click="openNewForm"
            >
            <span class="mr-2">🔎</span>
            책 검색 / 추가
            </button>
        </div>     
        <div class="flex justify-end gap-x-1 py-3">
            <button class="inline-flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            @click="handleCancel">
            취소
            </button>
            <button class="inline-flex items-center px-3 py-2 bg-black text-white hover:bg-black/80 rounded-md transition-colors"
            @click="saveContent">
            저장
            </button>
        </div>
    </div>


    <!--책 등록 폼-->
    <div class="w-full max-w-7xl mx-auto px-3 lg:px-4" > 
       <div class="p-4 flex-1 overflow-y-auto">
         <!-- 
            <div class="flex justify-end py-2">
                <button
                class="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                @click="openNewForm"
                >
                <span class="mr-2">🔎</span>
                책 추가
                </button>
          </div> -->

          <div class="editor-container space-y-4">
            <!-- 기본 항목들 -->
            <div class="space-y-2 border-b border-gray-200">
              <div class="space-y-2">
                <!-- 1. 책 커버 이미지 첨부 -->
                <div class="form-group flex items-start py-2">
                    <div class="flex items-center gap-2 w-32 pt-2">
                        <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                        <label class="text-sm font-medium text-gray-700"
                            >책 커버</label
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

                <!-- 2. 책 제목 -->
                <div class="form-group flex items-center">
                  <div class="flex items-center gap-2 w-32">
                    <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                    <label class="text-sm font-medium text-gray-700"
                      >책 제목</label
                    >
                  </div>
                  <input
                    type="text"
                    v-model="bookInfo.bookTitle"
                    class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                    placeholder="비어있음"
                  />
                </div>

                <!-- 3. 저자 -->
                <div class="form-group flex items-center">
                  <div class="flex items-center gap-2 w-32">
                    <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                    <label class="text-sm font-medium text-gray-700"
                      >저자</label
                    >
                  </div>
                  <input
                    type="text"
                    v-model="bookInfo.author"
                    class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                    placeholder="비어있음"
                  />
                </div>

                <!-- 4. 출판사 -->
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
                    class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                    placeholder="비어있음"
                    />
                </div>

                <!-- 5. 분야 -->
                <div class="form-group flex items-center">
                  <div class="flex items-center gap-2 w-32">
                    <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                    <label class="text-sm font-medium text-gray-700"
                      >분야</label
                    >
                  </div>
                  <input
                    type="text"
                    v-model="bookInfo.category"
                    class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                    placeholder="비어있음"
                  />
                </div>


                <!-- 6. 소장 유형 -->
                <div class="form-group flex items-center">
                  <div class="flex items-center gap-2 w-32">
                    <InputIcons type="select" class="w-4 h-4 text-gray-400" />
                    <label class="text-sm font-medium text-gray-700"
                      >소장 유형</label
                    >
                  </div>
  
                  <div class="flex-1 relative">
                    <button
                      type="button"
                      @click="toggleDropdown('collectionType')"
                      class="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700 flex justify-between items-center"
                    >
                      <span class="text-gray-700">
                        {{
                          getSelectedLabel("collectionType", readingTypeOptions)
                        }}
                      </span>
                      <ChevronIcon :is-open="openDropdown === 'collectionType'" />
                    </button>

                    <div
                      v-if="openDropdown === 'collectionType'"
                      class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
                    >
                      <div class="py-1">
                        <button
                          v-for="option in readingTypeOptions"
                          :key="option.value"
                          @click="selectOption('collectionType', option.value)"
                          class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
                          :class="{
                            'bg-gray-50': bookInfo.collectionType === option.value,
                            'font-medium':
                              bookInfo.collectionType === option.value,
                          }"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 7. 독서 상태 -->
                <div class="form-group flex items-center">
                  <div class="flex items-center gap-2 w-32">
                    <InputIcons type="select" class="w-4 h-4 text-gray-400" />
                    <label class="text-sm font-medium text-gray-700"
                      >독서 상태</label
                    >
                  </div>
                  <div class="flex-1 relative">
                    <button
                      type="button"
                      @click="toggleDropdown('readStatus')"
                      class="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700 flex justify-between items-center"
                    >
                      <span class="text-gray-700">
                        {{ getSelectedLabel("readStatus", statusOptions) }}
                      </span>
                      <ChevronIcon :is-open="openDropdown === 'readStatus'" />
                    </button>

                    <div
                      v-if="openDropdown === 'readStatus'"
                      class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
                    >
                      <div class="py-1">
                        <button
                          v-for="option in statusOptions"
                          :key="option.value"
                          @click="selectOption('readStatus', option.value)"
                          class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
                          :class="{
                            'bg-gray-50': bookInfo.readStatus === option.value,
                            'font-medium': bookInfo.readStatus === option.value,
                          }"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            <!-- 8. 독서 시작 날짜 -->
            <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                <InputIcons type="date" class="w-4 h-4 text-gray-400" />
                <label class="text-sm font-medium text-gray-700"
                    >독서 시작 날짜</label
                >
                </div>
                <input
                type="date"
                v-model="bookInfo.readStartDate"
                class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                />
            </div>

            <!-- 9. 독서 종료 날짜 -->
            <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                <InputIcons type="date" class="w-4 h-4 text-gray-400" />
                <label class="text-sm font-medium text-gray-700"
                    >독서 종료 날짜</label
                >
                </div>
                <input
                type="date"
                v-model="bookInfo.readEndDate"
                class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                />
            </div>

            <!-- 10. Total Page -->
            <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                <label class="text-sm font-medium text-gray-700"
                    >전체 페이지</label
                >
                </div>
                <input
                type="number"
                v-model="bookInfo.totalPages"
                class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                placeholder="비어있음"
                />
            </div>

            <!-- 11. Page Read -->
            <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                <InputIcons type="text" class="w-4 h-4 text-gray-400" />
                <label class="text-sm font-medium text-gray-700"
                    >읽은 페이지</label
                >
                </div>
                <input
                type="number"
                v-model="bookInfo.readPage"
                class="flex-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                placeholder="비어있음"
                />
            </div>


            <!-- 12. 별점 -->
            <div class="form-group flex items-center">
                <div class="flex items-center gap-2 w-32">
                <StarIcon size="sm" />
                <label class="text-sm font-medium text-gray-700"
                 >별점</label
                >
                </div>
                <div class="flex-1">
                <StarRating v-model="bookInfo.scope" />
                </div>
            </div>

            <!--책 기록-->
            <div>
                <div v-for="(block, index) in blocks" :key="index" class="relative mb-4">
                    <textarea
                        v-model="block.content"
                        class="w-full p-3 resize-none rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700"
                        rows="4"
                        placeholder="내용을 입력하세요."
                        @input="autoResizeTextarea"
                        :ref="el => textareaRefs[index] = el"
                    ></textarea>
                    
                    <button
                    v-if="index !== 0 && blocks.length > 1"
                    type="button"
                    @click="removeBlock(index)"
                    class="absolute top-1 right-1 text-gray-600 hover:text-black bg-transparent p-0 m-0 w-5 h-5 flex items-center justify-center text-lg font-bold"
                    aria-label="삭제"
                    >
                    ×
                    </button>
                </div>


                <button @click="addBookRecord"
                    class="w-full bg-black text-white hover:bg-black/80 rounded-md px-4 py-2 transition-colors"
                >
                    추가하기
                </button>
            </div>
           </div>
          </div>
        </div>
    </div>
  </div>

  <BookSearchForm v-model="isBookSearchFormVisible" :is-new="isNewForm"  @selectBook="fillBookInfo" />
</template>


<script setup>
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  computed,
  reactive,
} from "vue"

import { useEditorInput } from "@/composables/useEditorInput"
import InputIcons from "@/components/icons/InputIcons.vue"
import ChevronIcon from "@/components/icons/ChevronIcon.vue"
import StarIcon from "@/components/icons/StarIcon.vue"
import CloseIcon from "@/components/icons/CloseIcon.vue"
import ImageIcon from "@/components/icons/ImageIcon.vue"
import StarRating from "@/components/common/StarRating.vue"
import BookSearchForm from "@/components/common/BookSearchForm.vue"
import { useRouter } from "vue-router"
import axios from "axios"

const props = defineProps({
  isNew: Boolean,
  modelValue: Boolean,
})

const emit = defineEmits(["update:modelValue"])

const { handleKeyDown, handleBlockInput } = useEditorInput()

const bookInfo = reactive({
  bookTitle: "",
  author: "",
  category: "",
  scope: 0,
  collectionType: "선택하세요",
  readStatus: "선택하세요",
  publisher: "",
  readStartDate: new Date().toISOString().split("T")[0],
  readEndDate: "",
  readPage: null,
  totalPages: null,
  coverImage: null,
})

const resetForm = () => {
  bookInfo.bookTitle = ""
  bookInfo.author = ""
  bookInfo.category = ""
  bookInfo.scope = 0
  bookInfo.collectionType = "paper_book"
  bookInfo.readStatus = "reading"
  bookInfo.publisher = ""
  bookInfo.readStartDate = new Date().toISOString().split("T")[0]
  bookInfo.readEndDate = ""
  bookInfo.readPage = null
  bookInfo.totalPages = null
  bookInfo.coverImage = null
  blocks.value = [{ content: "" }]
  textareaRefs.length = 0
}

const blocks = ref([{ content: "" }])
const textareaRefs = []

const autoResizeTextarea = () => {
  nextTick(() => {
    textareaRefs.forEach(textarea => {
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = textarea.scrollHeight + "px"
      }
    })
  })
}

const addBookRecord = () => {
  const lastBlock = blocks.value[blocks.value.length - 1]
  if (!lastBlock.content || lastBlock.content.trim() === "") {
    alert("내용을 작성해주세요.")
    return
  }
  blocks.value.push({ content: "" })
  nextTick(() => autoResizeTextarea())
}

const removeBlock = (index) => {
  blocks.value.splice(index, 1)
  nextTick(() => autoResizeTextarea())
}

const router = useRouter()
const handleCancel = () => {
  if (confirm("작성을 취소하시겠습니까?")) {
    router.push("/")
  }
}

const validateBlocks = () => {
  for (const [index, block] of blocks.value.entries()) {
    if (!block.content || block.content.trim() === "") {
      alert(`내용을 입력하세요. (입력칸 ${index + 1}번)`)
      return false
    }
  }
  return true
}

// const saveContent = () => {
//   if (!validateBlocks()) return

//   const formData = {
//     bookInfo,
//     blocks: blocks.value,
//   }
//   console.log("저장될 데이터:", formData)
//   alert("저장되었습니다.")
//   closeForm()
// }


//이미지 처리
const imagePreview = ref(null)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert("파일 크기는 2MB를 초과할 수 없습니다.")
    event.target.value = ""
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    bookInfo.coverImage = file
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  bookInfo.coverImage = null
}


//저장
const saveContent = async () => {
  if (!validateBlocks()) return

  const formData = new FormData()

  const { coverImage, ...bookInfoWithoutImage } = bookInfo

  formData.append("bookInfo", JSON.stringify(bookInfoWithoutImage))
  formData.append("blocks", JSON.stringify(blocks.value))

  if (coverImage) {
    formData.append("coverImage", coverImage)
  }

  try {
    const response = await axios.post("/my-book", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    alert("저장되었습니다.")
    closeForm()
  } catch (error) {
    console.error("저장 실패:", error)
    alert("저장에 실패했습니다.")
  }
}



const openDropdown = ref(null)

const toggleDropdown = (key) => {
  openDropdown.value = openDropdown.value === key ? null : key
}

const selectOption = (key, value) => {
  bookInfo[key] = value
  openDropdown.value = null
}

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
  }
}


const hoverRating = ref(0)

const setRating = (value) => {
  bookInfo.scope = value
}

const getStarWidth = (position) => {
  const scope = hoverRating.value || bookInfo.scope
  const difference = scope - position + 1
  if (difference >= 1) return "100%"
  if (difference <= 0) return "0%"
  return `${difference * 100}%`
}

const isNewForm = ref(true)
const isBookSearchFormVisible = ref(false)

const openNewForm = () => {
  isBookSearchFormVisible.value = true
}

// 옵션 데이터
const readingTypeOptions = [
  { value: "paper_book", label: "종이책" },
  { value: "ebook", label: "eBook" },
  { value: "pending", label: "구매 예정" },
]

const statusOptions = [
  { value: "unread", label: "읽기 전" },
  { value: "reading", label: "읽는 중" },
  { value: "finished", label: "완독" },
]


// 책 선택 시 정보 반영
function fillBookInfo(selected) {
  bookInfo.bookTitle = selected.title
  bookInfo.author = selected.author
  bookInfo.publisher = selected.publisher
  //bookInfo.category = selected.categoryName || ""
  // cover 이미지도 필요한 경우 별도로 preview 설정
  imagePreview.value = selected.cover
  
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

/* 별점 컨테이너 스타일 수정 */
.star-container {
  position: relative;
  width: 2em;
  height: 2em;
  display: inline-block;
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

/* 별 문자가 깨지지 않도록 보정 */
.star-container span {
  line-height: 1;
  user-select: none;
}

/* hover 효과 */
.star-container button:hover ~ div {
  color: #fcd34d;
}

.h-0 {
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
