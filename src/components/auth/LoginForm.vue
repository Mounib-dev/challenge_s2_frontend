<template>
  <v-card class="w-75 mx-auto">
    <v-responsive class="mx-auto" max-width="344">
      <v-form @submit.prevent="login">
        <v-alert
          v-if="loginResponse"
          :type="alertType"
          variant="outlined"
          class="my-5"
          :icon="alertIcon"
        >
          {{ authResponse }}
        </v-alert>
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
import { useRouter } from 'vue-router'
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      rules: {
        required: (value) => !!value || 'Field is required'
      },
      loading: false,
      authResponse: '',
      loginResponse: false,
      alertIcon: 'mdi-close-box',
      alertType: 'error'
    }
  },
  methods: {
    async login() {
      this.loading = true
      const authStore = useAuthStore()
      this.authResponse = await authStore.login({ email: this.username, password: this.password })
      if (
        this.authResponse === 'Authentication successful, please wait as you will be redirected'
      ) {
        this.alertType = 'success'
        this.alertIcon = 'mdi-check-circle'
        this.loginResponse = true
        return setTimeout(() => {
          this.loading = false
          this.$router.push('/')
        }, 1500)
      }
      this.loading = false
      if (this.authResponse === 'Invalid credentials.') {
        this.loginResponse = true
      } else if (this.authResponse === "We couldn't find an account associated with this email.") {
        this.loginResponse = true
      } else {
        this.alertIcon = 'mdi-emoticon-sad-outline'
        this.loginResponse = true
      }
      console.log(authResponse)
    }
  }
}
</script>
