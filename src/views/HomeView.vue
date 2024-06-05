<script lang="ts">
import { computed, onMounted } from 'vue'
import { useSnackbarStore } from '../stores/snackbar'
import { useAuthStore } from '@/stores/auth'
// import { mapState } from 'pinia'
export default {
  data() {
    return {
      previousPage: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next((componentInstance) => {
      componentInstance.previousPage = from.fullPath
    })
  },
  setup() {
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const token = computed(() => authStore.token)

    const isAuthenticated = computed(() => {
      return token.value && user.value
    })

    return {
      user,
      token,
      isAuthenticated
    }
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
    }
  },
  async mounted() {
    console.log('mounted?')
    if (this.isAuthenticated) {
      await useAuthStore().fetchUser()
    }
    const snackbarStore = useSnackbarStore()
    if (useAuthStore().isAuthenticated && this.previousPage === '/login') {
      console.log('test mounted')
      return snackbarStore.showSnackbar(`Welcome, you are now authenticated`)
    }
    //Le code ci-dessous ne marche pas encore carte l'URL '/logout' n'existe pas encore
    if (this.previousPage === '/logout') {
      console.log('test mounted')
      return snackbarStore.showSnackbar(`Successefuly disconnected!`)
    }
  }
}
</script>

<template>
  <v-container>
    <div>
      <h1>Welcome {{ user.firstname }}</h1>
    </div>
  </v-container>
</template>

<style></style>
