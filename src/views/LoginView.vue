<template>
  <v-sheet class="mx-auto" width="300" style="padding-top: 400px;">
    <v-form ref="form">
      <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        clearable
        clear-icon="mdi:mdi-close-circle"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="nameRules"
        hint="Enter your password to access this website"
        label="Password"
        type="password"
        clearable
        clear-icon="mdi:mdi-close-circle"
        required
      ></v-text-field>

      <v-checkbox
        v-model="checkbox"
        :rules="[v => !!v || 'You must agree to continue!']"
        label="Do you agree?"
        required
      ></v-checkbox>

      <div class="d-flex flex-column">
        <v-btn
          class="mt-4"
          color="success"
          block
          @click="validate"
        >
          Validate
        </v-btn>

        <v-btn
          class="mt-4"
          color="error"
          block
          @click="reset"
        >
          Reset Form
        </v-btn>

        <v-btn
          class="mt-4"
          color="warning"
          block
          @click="resetValidation"
        >
          Reset Validation
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
<script>
  export default {
    name: 'LoginView',
    data: () => ({
      name: '',
      password: '',
      nameRules: [
        v => !!v || 'Field is required',
      ],
      checkbox: false,
    }),

    methods: {
      async validate () {
        const { valid } = await this.$refs.form.validate()

        if (valid) alert('Form is valid')
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>