<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >

        <div class="text-subtitle-1 text-medium-emphasis">계정</div>

        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="rules"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          비밀번호
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            로그인 비밀번호를 잊으셨나요?</a>
        </div>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            경고: 3회 연속으로 로그인에 실패하면 계정이 3시간 동안 일시적으로 잠깁니다. 지금 로그인해야 하는 경우 아래의 "로그인 비밀번호를 잊으셨나요?"를 클릭하여 로그인 비밀번호를 재설정할 수도 있습니다.
          </v-card-text>
        </v-card>

        <v-btn
          :disabled="!form"
          :loading="loading"
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
          block
        >
          로그인
        </v-btn>

        <v-card-text class="text-center">
          <router-link
            class="text-blue text-decoration-none"
            to="/user/join"
            rel="noopener noreferrer"
          >
            지금 가입하세요 <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
<script>
  export default {
    name: 'LoginView',
    data: () => ({
      form: false,
      email: null,
      password: null,
      loading: false,
      visible: false,
      rules: [
        value => !!value || 'Field is required',
        value => (value || '').length <= 20 || 'Max 20 characters',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail'
        },
      ],
    }),

    methods: {
      onSubmit () {
        if (!this.form) return

        this.loading = true
        setTimeout(() => (
          // this.loading = false
          this.$router.push(`/`).catch(() => {}) // 2초후에 페이지 이동
        ), 2000)
      },
      required (v) {
        return !!v || 'Field is required'
      },
    },
  }
</script>