<script lang="ts">
import { useSnackbarStore } from '../stores/snackbar'
import { useAuthStore } from '@/stores/auth'
export default {
  mounted() {
    const snackbarStore = useSnackbarStore()
    // console.log(useAuthStore().$state.user.firstname)
    // const currentUser = useAuthStore().$state.user.firstname
    // console.log(currentUser)
    if (useAuthStore().isAuthenticated) {
      console.log('test mounted')
      return snackbarStore.showSnackbar(`Welcome, you are now authenticated`)
    }
  }
}
</script>

<template>
  <v-main>
    <div>
      <h1>Welcome</h1>
    </div>
  </v-main>
</template>
