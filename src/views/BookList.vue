<template>
  <!-- Navigation -->
  <AppNavigation />

  <!-- Header-->
  <!-- <header class="bg-dark py-5">
    <div class="container px-4 px-lg-5 my-5">
      <div class="text-center text-white">
        <h1 class="display-4 fw-bolder">Shop in style</h1>
        <p class="lead fw-normal text-white-50 mb-0">With this shop hompeage template</p>
      </div>
    </div>
  </header> -->
  <div class="d-flex justify-space-around align-center bg-grey-lighten-4 justify-center">
    <v-hover v-slot="{ isHovering, props }">

        <v-img
          :aspect-ratio="1"
          class="bg-white"
          src="src/assets/img/aBookTrackerImage.png"
          width="100%"
          max-height="300"
          cover
        >
          <!-- <div class="d-flex fill-height justify-center align-center">
            <div class="text-h5">
              (랜덤) 이 책의 한 줄
            </div>
          </div> -->
        </v-img>
    </v-hover>
  </div>


  <!-- Content section-->
  <section class="py-5">
    <v-container class="container px-4 px-lg-5 mt-3">
      <!-- 상단 버튼 -->
      <!-- <div class="mb-1">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-pen"
          base-color="grey-darken-4"
          to="/1"
        >
          독서 기록 작성
        </v-btn>
      </div> -->
      <div class="mb-3">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-book-open-variant-outline"
          base-color="grey-darken-4"
          to="/1"
        >
          책장에 책 추가
        </v-btn>
      </div>

      <!-- 리스트 -->
      <v-tabs
        v-model="tab"
        align-tabs="start"
        color="grey-darken-4"
        show-arrows
      >
        <v-tab
          v-for="tabInfo, index in tabList"
          :key="index"
          :text="tabInfo.tabDisplayName"
          :value="tabInfo.tabNo"
          @click="processingData(tabInfo.tabName)"
        ></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="tabInfo, index in tabList"
          :key="index"
          :value="tabInfo.tabNo"
          transition="fade-transition"
          reverse-transition="fade-transition"
        >
          <!-- 검색 필터 -->
          <div>
            <div class="d-flex flex-row-reverse">
              <v-sheet class="mt-2 ml-2 mr-4 mb-0">
                <v-select
                  v-model="orderSelected"
                  label="정렬"
                  :items="orderSelectList"
                  item-title="orderDisplayName"
                  item-value="orderName"
                  variant="outlined"
                  density="compact"
                  width="150"
                  hide-details="true"
                ></v-select>
              </v-sheet>
              <v-sheet class="mt-2 ml-2">
                <v-select
                  v-model="categorySelected"
                  label="분야"
                  :items="categorySelectList"
                  item-title="categoryDisplayName"
                  item-value="categoryName"
                  variant="outlined"
                  density="compact"
                  width="150"
                  hide-details="true"
                ></v-select>
              </v-sheet>
              <v-sheet class="mt-2 ml-2">
                <v-select
                  v-model="readingTypeSelected"
                  label="독서 유형"
                  :items="readingTypeSelectList"
                  item-title="readingDisplayName"
                  item-value="readingName"
                  variant="outlined"
                  density="compact"
                  width="150"
                  hide-details="true"
                ></v-select>
              </v-sheet>
            </div>
          </div>

          <v-divider></v-divider>

          <v-container fluid>
            <!-- 리스트 > 컴포넌트로 빼면 될듯 ?-->
             <template v-if="bookList.length > 0">
              <v-row
                class="fill-height row gx-4 gx-lg-5 row-cols-1 row-cols-md-3 row-cols-xl-4"
                justify="start"
              >
                <template v-for="(item, i) in bookList" :key="i">
                  <v-col>
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        :class="{ 'on-hover': isHovering }"
                        :elevation="isHovering ? 12 : 2"
                        v-bind="props"
                      >
                        <v-img
                          :src="item.img"
                          height="300px"
                          cover
                        >
                          <div class="align-self-center text-right">
                            <v-btn
                              :class="{ 'show-btns': isHovering }"
                              class="ma-1"
                              :color="transparent"
                              icon="mdi-close"
                              variant="tonal"
                              size="x-small"
                              @click="deleteBook(item)"
                            ></v-btn>
                            <!-- [사용법] 버튼 여러개 사용할 때 -->
                            <!-- <v-btn
                              v-for="(icon, index) in icons"
                              :key="index"
                              :class="{ 'show-btns': isHovering }"
                              class="ma-1"
                              :color="transparent"
                              :icon="icon"
                              variant="tonal"
                              size="x-small"
                            ></v-btn> -->
                          </div>
                        </v-img>

                        <v-card-title class="pt-4 text-body-1 font-weight-bold">
                          {{ item.title }}
                        </v-card-title>

                        <v-card-text>
                          <div class="text-body-2 font-weight-black mb-1">{{ item.readingRate }}%</div>

                          <v-progress-linear
                            bg-color="surface-variant"
                            class="mb-2"
                            color="primary"
                            height="10"
                            :model-value="item.readingRate"
                            rounded="pill"
                          ></v-progress-linear>

                          <!-- 별점 -->
                          <v-rating
                            :model-value="item.rating"
                            color="amber"
                            density="compact"
                            size="small"
                            half-increments
                            readonly
                          ></v-rating>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-col>
                </template>
              </v-row>
            </template>
            <div v-else class="text-center pa-md-10 mx-lg-auto">
              <div class="text-caption">데이터가 없습니다</div>
            </div>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </section>

  <AppFooter />

</template>

<script>
const list = [
  {
    bookNo: 1,
    title: '읽기 전 책이름 (1)',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 0,
    readingRate: 0,
    status: 'beforeReading',
  },
  {
    bookNo: 2,
    title: '소년이 온다',
    img: 'https://image.yes24.com/goods/13137546/XL',
    rating: 5,
    readingRate: 100,
    status: 'readingCompleted',
  },
  {
    bookNo: 3,
    title: '완독2',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
    rating: 4.5,
    readingRate: 100,
    status: 'readingCompleted',
  },
  {
    bookNo: 4,
    title: '읽기 전 책이름 (2)',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
    rating: 0,
    readingRate: 10,
    status: 'beforeReading',
  },
  {
    bookNo: 5,
    title: '읽기 전 책이름 (3)',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 0,
    readingRate: 55,
    status: 'beforeReading',
  },
  {
    bookNo: 6,
    title: '읽는 중 (1)',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
    rating: 3,
    readingRate: 78,
    status: 'reading',
  },
  {
    bookNo: 7,
    title: '읽는 중 (2)',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
    rating: 2,
    readingRate: 12,
    status: 'reading',
  },
  {
    bookNo: 8,
    title: '완독3',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 1,
    readingRate: 100,
    status: 'readingCompleted',
  },
  {
    bookNo: 9,
    title: '완독4',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
    rating: 5,
    readingRate: 100,
    status: 'readingCompleted',
  },
  {
    bookNo: 10,
    title: '읽는 중 (3)',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
    rating: 2,
    readingRate: 70,
    status: 'reading',
  },
  {
    bookNo: 11,
    title: '읽는 중 (4)',
    img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
    rating: 1,
    readingRate: 10,
    status: 'reading',
  },
  {
    bookNo: 12,
    title: '읽기 전 책이름 (4)',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 0,
    readingRate: 0,
    status: 'beforeReading',
  },
  {
    bookNo: 13,
    title: '읽기 전 책이름 (5)',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 0,
    readingRate: 0,
    status: 'beforeReading',
  },
  {
    bookNo: 14,
    title: '읽기 전 책이름 (6)',
    img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    rating: 0,
    readingRate: 0,
    status: 'beforeReading',
  },
]

export default {
  name: 'BookList',
  data: () => ({
    dialog: false,
    tab: null,
    tabList: [
      {
        'tabNo': 1,
        'tabName': 'all',
        'tabDisplayName': '전체 책장',
      },
      {
        'tabNo': 2,
        'tabName': 'beforeReading',
        'tabDisplayName': '읽기 전',
      },
      {
        'tabNo': 3,
        'tabName': 'reading',
        'tabDisplayName': '읽는 중',
      },
      {
        'tabNo': 4,
        'tabName': 'readingCompleted',
        'tabDisplayName': '완독',
      },
    ],
    icons: ['mdi-close'],
    originBookList: [],
    bookList: [],
    readingTypeSelectList: [
      {'readingDisplayName': '전체', 'readingName': 'all'},
      {'readingDisplayName': '소장', 'readingName': 'collection'},
      {'readingDisplayName': 'eBook', 'readingName': 'eBook'},
    ], // 독서 유형
    readingTypeSelected: {'readingDisplayName': '전체', 'readingName': 'all'}, // 독서 유형
    categorySelectList: [
      {'categoryDisplayName': '전체', 'categoryName': 'all'},
      {'categoryDisplayName': '소설', 'categoryName': 'novel'},
      {'categoryDisplayName': '장르소설', 'categoryName': 'genreNovel'},
      {'categoryDisplayName': '에세이', 'categoryName': 'essay'},
    ], // 분야(카테고리)
    categorySelected: {'categoryDisplayName': '전체', 'categoryName': 'all'}, // 분야(카테고리)
    orderSelectList: [
      {'orderDisplayName': '최신순', 'orderName': 'latestOrder'},
      {'orderDisplayName': '별점순', 'orderName': 'starRatingOrder'},
    ], // 정렬
    orderSelected: {'orderDisplayName': '최신순', 'orderName': 'latestOrder'}, // 정렬
    transparent: 'rgba(255, 255, 255, 0)',
  }),
  props: {
  },
  methods: {
    loadData () {
      this.bookList = list
      this.originBookList = JSON.parse(JSON.stringify(this.bookList)) // 복사
    },
    processingData (status) {
      this.bookList = this.originBookList
      if (status !== 'all') {
        this.bookList = this.bookList.filter(book => book.status === status)
      }
    },
    deleteBook (bookInfo) {
      this.dialog = true
      this.bookList = this.bookList.filter(book => book.bookNo !== bookInfo.bookNo)
    },
  },
  created () {
    this.loadData()
  }
}
</script>

<style scoped>
  .v-card {
    transition: opacity .4s ease-in-out;
  }

  .v-card:not(.on-hover) {
    opacity: 0.6;
  }

  .show-btns {
    color: rgba(255, 255, 255, 1) !important;
  }

</style>
