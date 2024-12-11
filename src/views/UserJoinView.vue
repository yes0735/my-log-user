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
      title="User Registration"
    >
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-container>
          <v-text-field
            v-model="first"
            :rules="[required]"
            color="primary"
            label="First name"
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="last"
            :rules="[required]"
            color="primary"
            label="Last name"
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="rules"
            color="primary"
            label="Email"
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="[required]"
            :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="visible ? 'text' : 'password'"
            color="primary"
            label="Password"
            placeholder="Enter your password"
            variant="underlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-checkbox
            v-model="terms"
            :rules="[required]"
            color="secondary"
            label="I agree to site terms and conditions"
          ></v-checkbox>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="!form"
            color="success"
            type="submit"
          >
            Complete Registration

            <v-icon icon="mdi-chevron-right" end></v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

  <script>
  export default {
    name: 'UserJoinView',
    data: () => ({
      form: false,
      first: null,
      last: null,
      email: null,
      password: null,
      terms: false,
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
    props: {
    },

    methods: {
      onSubmit () {
        // alert("@@")
        if (!this.form) return
        // home 화면으로 이동
        this.$router.push(`/login`).catch(() => {})

        // this.loading = true

        // setTimeout(() => (this.loading = false), 2000)
      },
      required (v) {
        return !!v || 'Field is required'
      },
    },
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
