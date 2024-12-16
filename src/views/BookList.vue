<template>
  <div class="w-full mx-auto pb-10">
    <ContentsCover />
    <!-- 상단 버튼 -->
    <div class="w-full max-w-7xl mx-auto px-4 lg:px-5">
      <div class="mb-1">
        <a-button type="primary" ghost to="/1">
          <template #icon><EditOutlined /></template>
          독서 기록 작성
        </a-button>
      </div>
      <div class="mb-3">
        <a-button type="default" to="/1">
          <template #icon><BookOutlined /></template>
          책장에 책 추가
        </a-button>
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
              v-model:value="categorySelected"
              style="width: 150px"
              placeholder="분야"
            >
              <a-select-option
                v-for="category in categorySelectList"
                :key="category.categoryName"
                :value="category.categoryName"
              >
                {{ category.categoryDisplayName }}
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
                      <img
                        :src="item.img"
                        class="h-[300px] w-full object-cover"
                      />
                      <div class="absolute top-2 right-2">
                        <button type="button" @click="deleteBook(item)">
                          <CloseOutlined
                            class="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] text-xl"
                          />
                        </button>
                      </div>
                    </div>
                  </template>
                  <a-card-meta :title="item.title">
                    <template #description>
                      <div class="font-bold mb-1">{{ item.readingRate }}%</div>
                      <a-progress
                        :percent="item.readingRate"
                        :show-info="false"
                        status="normal"
                      />
                      <a-rate :value="item.rating" allow-half disabled />
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
  </div>
</template>

<script setup>
import ContentsCover from "@/components/common/ContentsCover.vue"

import {
  EditOutlined,
  BookOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue"
import { ref, onMounted } from "vue"
import { useHttp } from "@/api/http"

const list = [
  {
    bookNo: 1,
    title: "읽기 전 책이름 (1)",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 0,
    readingRate: 0,
    status: "beforeReading",
  },
  {
    bookNo: 2,
    title: "소년이 온다",
    img: "https://image.yes24.com/goods/13137546/XL",
    rating: 5,
    readingRate: 100,
    status: "readingCompleted",
  },
  {
    bookNo: 3,
    title: "완독2",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg",
    rating: 4.5,
    readingRate: 100,
    status: "readingCompleted",
  },
  {
    bookNo: 4,
    title: "읽기 전 책이름 (2)",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg",
    rating: 0,
    readingRate: 10,
    status: "beforeReading",
  },
  {
    bookNo: 5,
    title: "읽기 전 책이름 (3)",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 0,
    readingRate: 55,
    status: "beforeReading",
  },
  {
    bookNo: 6,
    title: "읽는 중 (1)",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg",
    rating: 3,
    readingRate: 78,
    status: "reading",
  },
  {
    bookNo: 7,
    title: "읽는 중 (2)",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg",
    rating: 2,
    readingRate: 12,
    status: "reading",
  },
  {
    bookNo: 8,
    title: "완독3",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 1,
    readingRate: 100,
    status: "readingCompleted",
  },
  {
    bookNo: 9,
    title: "완독4",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg",
    rating: 5,
    readingRate: 100,
    status: "readingCompleted",
  },
  {
    bookNo: 10,
    title: "읽는 중 (3)",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg",
    rating: 2,
    readingRate: 70,
    status: "reading",
  },
  {
    bookNo: 11,
    title: "읽는 중 (4)",
    img: "https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg",
    rating: 1,
    readingRate: 10,
    status: "reading",
  },
  {
    bookNo: 12,
    title: "읽기 전 책이름 (4)",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 0,
    readingRate: 0,
    status: "beforeReading",
  },
  {
    bookNo: 13,
    title: "읽기 전 책이름 (5)",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 0,
    readingRate: 0,
    status: "beforeReading",
  },
  {
    bookNo: 14,
    title: "읽기 전 책이름 (6)",
    img: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    rating: 0,
    readingRate: 0,
    status: "beforeReading",
  },
]

const tabList = [
  {
    tabNo: 1,
    tabName: "all",
    tabDisplayName: "전체 책장",
  },
  {
    tabNo: 2,
    tabName: "beforeReading",
    tabDisplayName: "읽기 전",
  },
  {
    tabNo: 3,
    tabName: "reading",
    tabDisplayName: "읽는 중",
  },
  {
    tabNo: 4,
    tabName: "readingCompleted",
    tabDisplayName: "완독",
  },
]

const tab = ref(1)
const originBookList = ref([])
const bookList = ref([])
const http = useHttp()
const readingTypeSelectList = ref([
  { readingDisplayName: "전체", readingName: "all" },
  { readingDisplayName: "소장", readingName: "collection" },
  { readingDisplayName: "eBook", readingName: "eBook" },
])
const readingTypeSelected = ref("")
const categorySelectList = ref([
  { categoryDisplayName: "전체", categoryName: "all" },
  { categoryDisplayName: "소설", categoryName: "novel" },
  { categoryDisplayName: "장르소설", categoryName: "genreNovel" },
  { categoryDisplayName: "에세이", categoryName: "essay" },
])
const categorySelected = ref("")
const orderSelectList = ref([
  { orderDisplayName: "최신순", orderName: "latestOrder" },
  { orderDisplayName: "별점순", orderName: "starRatingOrder" },
])
const orderSelected = ref("")
const transparent = ref("rgba(255, 255, 255, 0)")

const loadData = () => {
  bookList.value = list
  originBookList.value = JSON.parse(JSON.stringify(bookList.value))
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
  categorySelected.value = "all"
  orderSelected.value = "최신순"
}

onMounted(() => {
  resetSelects()
})

const handleTabChange = (key) => {
  const tabInfo = tabList.find((tab) => tab.tabNo === key)
  if (tabInfo) {
    resetSelects()
    processingData(tabInfo.tabName)
  }
}

loadData()
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
