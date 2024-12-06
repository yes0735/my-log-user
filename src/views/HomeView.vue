<template>
  <!-- Navigation -->
  <AppNavigation />

  <!-- Header-->
  <header class="bg-dark py-5">
    <div class="container px-4 px-lg-5 my-5">
      <div class="text-center text-white">
        <h1 class="display-4 fw-bolder">Shop in style</h1>
        <p class="lead fw-normal text-white-50 mb-0">With this shop hompeage template</p>
      </div>
    </div>
  </header>


  <!-- Content section-->
  <section class="py-5">
    <div class="container px-4 px-lg-5 mt-5">
      <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
        <div v-for="n in 10" :key="n" class="col mb-5">
          <v-card
            class="mx-auto"
            max-width="344"
          >
            <v-img
              height="200px"
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              cover
            ></v-img>

            <v-card-title>
              Top western road trips
            </v-card-title>

            <v-card-subtitle>
              1,000 miles of wonder
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                color="orange-lighten-2"
                text="Explore"
                @click="$router.push('/1')"
              ></v-btn>

              <v-spacer></v-spacer>

              <v-btn
                :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"
                @click="show = !show"
              ></v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>

                <v-card-text>
                  I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </div>
    </div>
  </section>

  <AppFooter />


</template>

<script>

export default {
  name: 'HomeView',
  data: () => ({
      dataList: [],
      show: false,
    }),
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style> -->
