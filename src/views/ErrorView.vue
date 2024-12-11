<template>
    <v-empty-state
      action-text="Retry Request"
      image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
      text="There might be a problem with your connection or our servers. Please check your internet connection or try again later. We appreciate your patience."
      title="Something Went Wrong"
      @click="dialog = !dialog"
    ></v-empty-state>

    <!-- 알럿창 -->
    <v-sheet
      class="position-relative"
      min-height="450"
    >
      <v-fade-transition hide-on-leave>
        <v-card
          v-if="dialog"
          append-icon="$close"
          class="mx-auto"
          elevation="16"
          max-width="500"
          title="Send a receipt"
        >
          <template v-slot:append>
            <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
          </template>

          <v-divider></v-divider>

          <div class="py-12 text-center">
            <v-icon
              class="mb-6"
              color="success"
              icon="mdi-check-circle-outline"
              size="128"
            ></v-icon>

            <div class="text-h4 font-weight-bold">This receipt was sent</div>
          </div>

          <v-divider></v-divider>

          <div class="pa-4 text-end">
            <v-btn
              class="text-none"
              color="medium-emphasis"
              min-width="92"
              variant="outlined"
              rounded
              @click="dialog = false"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-fade-transition>
    </v-sheet>

  </template>

<!-- <script setup>
import { ref } from 'vue'

const dialog = ref(false)
</script> -->

<script>

export default {
  name: 'ErrorView',
  data: () => ({
    dialog: false,
  }),
  props: {
  },
  methods: {
    onClickAction () {
      this.dialog = true
      // alert('You clicked the action button')
    },
  },
}
</script>