<template>
  <v-container> <login-form></login-form></v-container>
</template>

<script>
import { defineComponent } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
export default defineComponent({
  name: 'Login',
  components: { LoginForm }
})
</script>
