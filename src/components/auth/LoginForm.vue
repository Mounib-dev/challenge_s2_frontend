<template>
  <v-card class="w-75 mx-auto">
    <v-responsive class="mx-auto" max-width="344">
      <v-form @submit.prevent="login">
        <v-text-field
          hide-details="auto"
          label="Email address"
          placeholder="example@gmail.com"
          :rules="[rules.required]"
          v-model="username"
          type="email"
          class="my-10"
        ></v-text-field>
        <v-text-field
          hide-details="auto"
          label="Password"
          :rules="[rules.required]"
          v-model="password"
          type="password"
          class="my-10"
        ></v-text-field>
        <v-btn :loading="loading" size="large" type="submit" variant="elevated" block class="mb-4">
          Sign In
          <v-icon class="ml-2">mdi-login-variant</v-icon>
        </v-btn>
      </v-form>
    </v-responsive>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      rules: {
        required: (value) => !!value || 'Field is required'
      },
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true
      const authStore = useAuthStore()
      await authStore.login({ email: this.username, password: this.password })
    }
  }
}
</script>
