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
  <div class="d-flex justify-space-around align-center bg-grey-lighten-4">
    <v-img
      :aspect-ratio="1"
      class="bg-white"
      src="src/assets/img/aBookTrackerImage.png"
      width="100%"
      max-height="300"
      cover
    >
      <v-card-title class="ma-10 text-body-4 font-weight-bold text-center">
        <p class="mt-4">
          독서 기록
        </p>
      </v-card-title>
    </v-img>
  </div>


  <!-- Content section-->
  <section class="py-5">
    <v-container class="container px-4 px-lg-5 mt-3">
      <!-- 상단 버튼 -->
      <div class="mb-1">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-pen"
          base-color="grey-darken-4"
          to="/1"
        >
          독서 기록 작성
        </v-btn>
      </div>
      <div class="mb-5">
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
        color="deep-purple-accent-4"
        show-arrows
      >
        <v-tab
          v-for="i in 30"
          :key="i"
          :text="'Item ' + i"
          :value="i"
        ></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="n in 30"
          :key="n"
          :value="n"
        >
          <v-container fluid>
            <!-- 리스트 > 컴포넌트로 빼면 될듯 ?-->
            <v-row
              align="center"
              class="fill-height row gx-4 gx-lg-5 row-cols-1 row-cols-md-3 row-cols-xl-4 justify-content-center"
              justify="center"
            >
              <template v-for="(item, i) in items" :key="i">
                <v-col>
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      :class="{ 'on-hover': isHovering }"
                      :elevation="isHovering ? 12 : 2"
                      v-bind="props"
                    >
                      <v-img
                        :src="item.img"
                        height="225px"
                        cover
                      >
                        <v-card-title class="text-h6 text-white d-flex flex-column text-center">
                          <p class="mt-4">
                            {{ item.title }}
                          </p>

                          <div>
                            <p class="ma-0 text-body-1 font-weight-bold text-center">
                              {{ item.text }}
                            </p>
                            <p class="text-caption font-weight-medium text-center">
                              {{ item.subtext }}
                            </p>
                          </div>
                        </v-card-title>
                        <div class="align-self-center text-center">
                          <v-btn
                            v-for="(icon, index) in icons"
                            :key="index"
                            :class="{ 'show-btns': isHovering }"
                            :color="transparent"
                            :icon="icon"
                            variant="text"
                          ></v-btn>
                        </div>
                      </v-img>

                      <v-card-subtitle class="pt-4">
                        {{ item.lastReadDatetime }}
                      </v-card-subtitle>

                      <v-card-text>
                        <div class="text-h4 font-weight-black mb-4">{{ item.readingRate }}%</div>

                        <v-progress-linear
                          bg-color="surface-variant"
                          class="mb-6"
                          color="primary"
                          height="10"
                          :model-value="item.readingRate"
                          rounded="pill"
                        ></v-progress-linear>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn color="orange" text="Share"></v-btn>
                        <v-btn color="orange" text="Explore" to="/about"></v-btn>
                      </v-card-actions>

                    </v-card>
                  </v-hover>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </section>

  <AppFooter />

</template>

<script>

export default {
  name: 'HomeView',
  data: () => ({
    tab: null,
    icons: ['mdi-rewind', 'mdi-play', 'mdi-fast-forward'],
      items: [
        {
          title: '책 이름',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          readingRate: 10,
          lastReadDatetime: '2024-11-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://image.yes24.com/goods/13137546/XL',
          readingRate: 15,
          lastReadDatetime: '2024-10-11 12:30:59',
          rating: 2,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 50,
          lastReadDatetime: '2024-12-10 10:30:59',
          rating: 5,
        },
        {
          title: 'New Releases',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
          readingRate: 10,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          readingRate: 55,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 1,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 78,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'New Releases',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
          readingRate: 12,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 2,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          readingRate: 90,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 4,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 100,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'New Releases',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
          readingRate: 89,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          readingRate: 30,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 2,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'New Releases',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
          readingRate: 46,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          readingRate: 100,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 30,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'New Releases',
          text: `It's New Release Friday`,
          subtext: 'Newly released songs.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/hands.jpg',
          readingRate: 5,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/singer.jpg',
          readingRate: 0,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 66,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Rock',
          text: 'Greatest Rock Hits',
          subtext: 'Lose yourself in rock tunes.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/singer.jpg',
          readingRate: 30,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
        {
          title: 'Mellow Moods',
          text: 'Ambient Bass',
          subtext: 'Chill beats to mellow you out.',
          img: 'https://cdn.vuetifyjs.com/docs/images/cards/concert.jpg',
          readingRate: 30,
          lastReadDatetime: '2024-12-11 12:30:59',
          rating: 3,
        },
      ],
      transparent: 'rgba(255, 255, 255, 0)',
    }),
  props: {
    msg: String
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
