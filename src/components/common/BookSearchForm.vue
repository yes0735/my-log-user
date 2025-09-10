<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="closeForm"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full md:h-[90vh] md:w-[600px] bg-white md:rounded-lg shadow-xl flex flex-col"
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between p-4 md:py-6 md:px-4 shrink-0">
          <div
            class="H1-B outline-none min-w-[100px] title-placeholder"
          >책 검색</div>
        </div>

        <!-- 책 검색 -->
        <h2 id="book-search-title" class="sr-only">책 검색 폼</h2>
        <form class="mt-6" @submit.prevent="onSubmit" aria-labelledby="book-search-title">
          <div class="flex flex-col gap-2 p-4 border-b shrink-0">
            <div class="form-group flex items-center">
              <a-select
                v-model:value="searchTargetSelected"
                style="width: 150px"
                placeholder="검색어 종류"
              >
                <a-select-option
                  v-for="type in searchTargetSelectList"
                  :key="type.readingName"
                  :value="type.readingName"
                >
                  {{ type.readingDisplayName }}
                </a-select-option>
              </a-select>

              <input
                id="searchValue" 
                type="text"
                v-model="searchValue"
                class="flex-1 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                placeholder="검색어를 입력해주세요"
              />
              <button
                class="px-3 py-1.5 bg-black text-white hover:bg-black/80 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isFormValid || loading"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              </button>
            </div>
            
          </div>
        </form>

        <!-- 에디터 영역 - 스크롤 가능하도록 수정 -->
        <div class="flex-1 p-4 h-[80px] overflow-y-auto">
          <div class="editor-container space-y-4">

            <div> 총 결과수 : {{ totalResults }}</div>

            <!-- 책 리스트 -->
            <div class="list-container">
              <template v-if="items.length > 0">
                <ul>
                  <li
                    v-for="item in items"
                    :key="item.itemId"
                    class="list-item"
                    @click="goToDetail(item)"
                  >
                    <img
                      :src="item.cover"
                      alt="썸네일"
                    />
                    
                    <div class="content flex flex-col space-y-1">
                      <h3 class="title max-w-full md:w-[400px] font-semibold text-base text-gray-900 truncate">
                        {{ item.title }}
                      </h3>

                      <!-- 줄 1 -->
                      <div
                        class="info-line flex flex-col md:flex-row gap-x-2 gap-y-1 text-sm text-gray-500"
                      >
                        <span class="truncate max-w-full md:w-[400px]">저자: {{ item.author }}</span>
                        <!-- <span class="hidden md:inline font-bold">|</span> -->
                      </div>

                      <!-- 줄 2 -->
                      <div
                        class="info-line flex flex-col md:flex-row gap-x-2 gap-y-1 text-sm text-gray-500"
                      >
                        <span class="truncate max-w-full md:max-w-[400px]">출판사: {{ item.publisher }}</span>
                      </div>

                      <!-- 줄 3 -->
                      <div
                        class="info-line flex flex-col md:flex-row gap-x-2 gap-y-1 text-sm text-gray-500"
                      >
                        <span class="truncate max-w-full md:w-[400px]">출간일: {{ formatDate(item.pubDate) }}</span>
                        <!-- <span class="hidden md:inline font-bold">|</span> -->
                        <!-- <span class="truncate max-w-full md:max-w-[120px]">판매가: {{ item.priceSales.toLocaleString() }}원</span> -->
                        <!-- <span class="truncate max-w-full md:w-[250px]">ISBN: {{ item.isbn }}</span> -->
                      </div>
                    </div>
                    
                  </li>
                </ul>
              </template>
              <template v-else>
                <div class="text-center text-gray-500 py-10">
                  📚 데이터가 없습니다.
                </div>
              </template>
            </div>

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
            @click="closeForm"
          >
            다음
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
import { useRouter } from 'vue-router'
import { useScrollLock } from "@/composables/useScrollLock"
import { useBookApi } from '@/store/bookApi'
import { useHttp } from '@/api/http'
import { useCommon } from '@/composables/useCommon'

const router = useRouter()
const bookApiStore = useBookApi()
const http = useHttp()
const { formatDate } = useCommon()

const props = defineProps({
  isNew: Boolean,
  modelValue: Boolean,
})

const emit = defineEmits(["update:modelValue", "selectBook"])
const loading = ref(false)
const items = ref([])
const totalResults = ref(0)
const searchValue = ref("")
const searchTargetSelected = ref("Book")
// 독서 유형
const searchTargetSelectList = ref([
  { readingDisplayName: "국내도서", readingName: "Book" },
  { readingDisplayName: "외국도서", readingName: "Foreign" },
  { readingDisplayName: "전자책(eBook)", readingName: "eBook" }
])

// 스크롤 잠금 훅 사용
const { lock, unlock } = useScrollLock()

// 초기화 함수 수정
const resetForm = () => {
  searchValue.value = ""
  searchTargetSelected.value = "Book"
  items.value = []
  totalResults.value = 0
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

const closeForm = () => {
  emit("update:modelValue", false)
}

// 유효성 검사
const isFormValid = computed(() =>
searchTargetSelected.value &&
  searchValue.value
)

// 검색 버튼 클릭 시 실행
async function onSubmit() {

  loading.value = true
  try {
    const payload = {
      searchType: searchTargetSelected.value,
      searchValue: searchValue.value,
    }

    const response = await bookApiStore.bookApiList(payload)

    if (http.isOk(response)) {
      items.value = response.result.list[0].item
      totalResults.value = response.result.list[0].totalResults
      // closeForm() // 팝업 종료
    } else {
      alert(http.getMessage(response))
    }
  } catch (error) {
    console.error('책 검색 실패:', error)
  } finally {
    loading.value = false
  }
}

// 책 선택시 등록 페이지 이동
function goToDetail(bookInfo) {
  emit("selectBook", bookInfo) // 부모에게 책 정보 전달
  emit("update:modelValue", false) // 모달 닫기
}



</script>

<style scoped>
.list-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 12px; /* ✅ 카드 간 간격 추가 */
  align-items: center; /* 세로 가운데 정렬 */
}
.list-item:last-child {
  margin-bottom: 0; /* ✅ 마지막 카드 하단 간격 제거 */
}
.list-item:hover {
  background-color: #f5f5f5;
}
.list-item .content {
  flex: 1;
}
.list-item .content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #111827;
}
.list-item .content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

/* 입력 그룹 */
.form-group {
  gap: 8px;
}

/* 제목 타이포 */
.title-placeholder {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

/* 버튼 hover 개선 */
button {
  transition: background-color 0.2s ease;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 책 검색 영역 */
input,
select {
  @apply text-sm h-8; /* 높이 통일 */
}
</style>
