
<template>
  <div class="w-full mx-auto pb-10">
    <ContentsCover />
    <!-- 상단 버튼 -->
    <div class="w-full max-w-7xl mx-auto px-4 lg:px-5">
      <div class="flex justify-end py-4">
        <button
          class="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
          @click="openNewForm"
        >
          <span class="mr-2">✏️</span>
          독서 기록 작성
        </button>
      </div>
      <!-- 리스트 -->
      <a-tabs v-model:activeKey="tab" @change="handleTabChange">
        <a-tab-pane
          v-for="(tabInfo, _index) in tabList"
          :key="tabInfo.tabNo"
          :tab="tabInfo.tabDisplayName"
        >
          <!-- 검색 필터 -->
          <div class="flex justify-end gap-2 mb-4">
            <a-select
              v-model:value="readingTypeSelected"
              style="width: 150px"
              placeholder="독서 유형"
            >
              <a-select-option
                v-for="type in readingTypeSelectList"
                :key="type.readingName"
                :value="type.readingName"
              >
                {{ type.readingDisplayName }}
              </a-select-option>
            </a-select>

            <a-select
              v-model:value="orderSelected"
              style="width: 150px"
              placeholder="정렬"
            >
              <a-select-option
                v-for="order in orderSelectList"
                :key="order.orderName"
                :value="order.orderName"
              >
                {{ order.orderDisplayName }}
              </a-select-option>
            </a-select>
          </div>

          <a-divider />

          <!-- 책 리스트 -->
          <div class="w-full">
            <template v-if="bookList.length > 0">
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <a-card
                  hoverable
                  class="h-full"
                  v-for="(item, i) in bookList"
                  :key="i"
                >
                  <template #cover>
                    <div class="relative">
                      <div
                        class="cursor-pointer group"
                        @click="openEditForm(item)"
                      >
                        <div v-if="item.bookImageLink" class="relative">
                          <img
                            :src="item.bookImageLink"
                            class="h-[300px] w-full object-cover transition-opacity group-hover:opacity-90 rounded-t-lg"
                          />
                        </div>
                        <div
                          v-else
                          class="h-[300px] w-full bg-gray-100 flex items-center justify-center text-gray-400 transition-colors group-hover:bg-gray-200 rounded-t-lg"
                        >
                          <span class="text-sm">이미지 없음</span>
                        </div>
                        <!-- 호버 시 나타나는 편집 힌트 -->
                        <div
                          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span
                            class="bg-black/50 text-white px-3 py-1.5 rounded-md text-sm"
                          >
                            수정하기
                          </span>
                        </div>
                      </div>
                      <div class="absolute top-2 right-2">
                        <button type="button" @click.stop="deleteBook(item)">
                          <CloseOutlined
                            class="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] text-xl"
                          />
                        </button>
                      </div>
                    </div>
                  </template>
                  <a-card-meta :title="item.bookTitle">
                    <template #description>
                      <div class="font-bold mb-1">
                        {{item.readPage && item.totalPage ? ((item.readPage * 100) / item.totalPage).toFixed(0) : 0}}%
                      </div>
                      <a-progress
                        :percent="item.readPage && item.totalPage ? (item.readPage * 100) / item.totalPage : 0"
                        :show-info="false"
                        status="normal"
                      />
                      <StarRating
                        :model-value="item.scope"
                        readonly
                        :show-score="false"
                      />
                    </template>
                  </a-card-meta>
                </a-card>
              </div>
            </template>
            <div v-else class="text-center py-10">
              <a-empty>
                <template #description>
                  <span class="text-gray-500">데이터가 없습니다</span>
                </template>
              </a-empty>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <LogForm v-model="isLogFormVisible" :is-new="isNewForm" />
    <div class="text-center mt-6" v-if="!isLastPage">
      <button class="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50" @click="loadNextPage">
          더보기
      </button>
    </div>  
  </div>

</template>

<script setup>
import ContentsCover from "@/components/common/ContentsCover.vue"
import LogForm from "@/components/common/LogForm.vue"
import BookSearchForm from "@/components/common/BookSearchForm.vue"
import StarRating from "@/components/common/StarRating.vue"
import { CloseOutlined } from "@ant-design/icons-vue"
import { ref, onMounted, watch } from "vue"
import { useHttp } from "@/api/http"
import { useBook } from "@/store/book"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

const tabList = [
  {
    tabNo: 1,
    tabName: "all",
    tabDisplayName: "전체 책장",
  },
  {
    tabNo: 2,
    tabName: "unread",
    tabDisplayName: "읽기 전",
  },
  {
    tabNo: 3,
    tabName: "reading",
    tabDisplayName: "읽는 중",
  },
  {
    tabNo: 4,
    tabName: "finished",
    tabDisplayName: "완독",
  },
]

const tab = ref(1)
const originBookList = ref([])
const bookList = ref([])
const http = useHttp()

const readingTypeSelectList = ref([
  { readingDisplayName: "소장유형", readingName: "all" },
  { readingDisplayName: "종이책", readingName: "paper_book" },
  { readingDisplayName: "eBook", readingName: "ebook" },
  { readingDisplayName: "구매예정", readingName: "pending" },
])
const readingTypeSelected = ref("all")



const orderSelectList = ref([
  { orderDisplayName: "최신순", orderName: "registrationDatetime" },
  { orderDisplayName: "별점순", orderName: "scope" },
])
const orderSelected = ref("registrationDatetime")

const transparent = ref("rgba(255, 255, 255, 0)")
const isLogFormVisible = ref(false)
const isBookSearchFormVisible = ref(false)
const isNewForm = ref(true)

const bookStore = useBook()

//페이징 변수
const currentPage = ref(0)           // 현재 페이지
const pageSize = ref(12)             // 한 번에 가져올 개수
const totalPages = ref(0)            // 총 페이지 수
const isLastPage = ref(false)        // 마지막 페이지 여부

//나의 책 데이터 로드
const isLoading = ref(false);
console.log(orderSelected.value) 
const loadData = async (readStatus=null) => {
  if (isLoading.value) return; // 이미 호출 중이면 무시

  isLoading.value = true;
  try {
    const res = await bookStore.bookList({
      page: currentPage.value,
      size: pageSize.value,
      readStatus: readStatus === "all" ? null : readStatus,
      collectionType: readingTypeSelected.value === "all" ? null : readingTypeSelected.value,
      sortBy: orderSelected.value,
    });
    const result = res.result;

    if (currentPage.value === 0) {
      bookList.value = result.content;// 첫 페이지면 덮어쓰기
    } else {
        bookList.value.push(...result.content); // 다음 페이지면 이어붙이기
    }
    totalPages.value = result.page.totalPages;
    isLastPage.value = currentPage.value + 1 >= totalPages.value;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  resetSelects();
  currentPage.value = 0;

  // 기본 탭의 tabName 찾아서 넘기기 (예: "all")
  const defaultTab = tabList.find(t => t.tabNo === tab.value);
  loadData(defaultTab?.tabName || "all");
});

 //다음 페이지 요청(더보기)
const loadNextPage = () => {
  currentPage.value += 1
  const currentTabInfo = tabList.find(t => t.tabNo === tab.value);
  const readStatus = currentTabInfo ? currentTabInfo.tabName : "all";
  loadData(readStatus);
}


const processingData = (status) => {
  bookList.value = originBookList.value
  if (status !== "all") {
    bookList.value = bookList.value.filter((book) => book.status === status)
  }
}

const deleteBook = async (bookInfo) => {
  await http.confirm({
    title: "시스템 관리자",
    message: "책을 삭제하시겠습니까?",
    okText: "삭제",
    cancelText: "취소",
    okType: "danger",
    onOk: () => {
      bookList.value = bookList.value.filter(
        (book) => book.bookNo !== bookInfo.bookNo
      )
    },
  })
}

const resetSelects = () => {
  readingTypeSelected.value = "all"
  //categorySelected.value = "all"
  orderSelected.value = "registrationDatetime"
}

// 소장 유형 변경 시
watch(readingTypeSelected, () => {
  currentPage.value = 0
  const currentTabInfo = tabList.find(t => t.tabNo === tab.value)
  bookList.value = []
  loadData(currentTabInfo?.tabName || "all")
})

// 정렬 순서 변경 시
watch(orderSelected, () => {
  currentPage.value = 0
  const currentTabInfo = tabList.find(t => t.tabNo === tab.value)
  bookList.value = []
  loadData(currentTabInfo?.tabName || "all")
})

const handleTabChange = (key) => {
  const tabInfo = tabList.find((tab) => tab.tabNo === key)
  if (tabInfo) {
    resetSelects()
    tab.value=key
    currentPage.value=0
    bookList.value=[]
    loadData(tabInfo.tabName)
    //processingData(tabInfo.tabName)->프론트 필터링
  }
}

const router = useRouter()

const openNewForm = () => {
  router.push("/book/write")
}

const openEditForm = (book) => {
  isNewForm.value = false
  isLogFormVisible.value = true
}

</script>

<style scoped>
.ant-card-cover img {
  object-fit: cover;
}

/* .ant-card-hoverable:hover {
  transform: translateY(-4px);
  transition: all 0.3s;
} */
</style>
