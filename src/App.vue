<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mapState } from 'pinia'
import Snackbar from '@/components/utils/Snackbar.vue'

export default {
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user', 'token']),
    isAuthenticated() {
      return this.token && this.user
    }
  },
  components: {
    Snackbar
  }
}
</script>

<template>
  <v-app>
    <snackbar></snackbar>
    <v-navigation-drawer class="bg-dark" theme="dark" permanent :width="200" expand-on-hover rail>
      <v-list-item link title="Dashboard" to="/" prepend-icon="mdi-view-dashboard"></v-list-item>
      <v-list-item
        link
        title="Employees"
        to="/teamMembers"
        prepend-icon="mdi-account-details"
      ></v-list-item>
      <v-list-item link title="Tasks" to="/" prepend-icon="mdi-clipboard-list"></v-list-item>
      <v-list-item link title="Teams" to="/" prepend-icon="mdi-account-group"></v-list-item>
      <v-divider></v-divider>

      <template v-slot:append>
        <v-list-item
          v-if="isAuthenticated"
          title="LOGOUT"
          prepend-icon="mdi-exit-run"
          @click="logout"
        ></v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-title>Workloads</v-app-bar-title>
      <v-btn v-if="!isAuthenticated" link to="/login" class="mr-2" rounded>Login</v-btn>
      <template v-slot:append>
        <v-btn v-if="!isAuthenticated" link to="/login" icon="mdi-login"></v-btn>
      </template>
      <h2 v-if="isAuthenticated" class="mr-4">{{ user.firstname }}</h2>
    </v-app-bar>
    <v-main> <RouterView /></v-main>
    <v-footer app
      ><div class="text-center align-center w-100">
        Mounib, Adama et Yasmine <v-icon>mdi-copyright</v-icon> 2024
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped></style>
