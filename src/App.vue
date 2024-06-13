<script lang="ts">
import { computed } from 'vue'
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
  setup() {
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const token = computed(() => authStore.token)
    console.log('User: ', user.value)
    const isAuthenticated = computed(() => {
      return token.value && user.value
    })

    return {
      user,
      token,
      isAuthenticated
    }
  },
  async mounted() {
    await useAuthStore().fetchUser()
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
      <v-list-item link title="Tasks" to="/tasks" prepend-icon="mdi-clipboard-list"></v-list-item>
      <v-list-item link title="Teams" to="/teams" prepend-icon="mdi-account-group"></v-list-item>
      <v-list-item
        link
        title="Workloads"
        to="/workloads"
        prepend-icon="mdi-calendar-month-outline"
      ></v-list-item>
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
      <v-app-bar-title>Workloads Planner</v-app-bar-title>
      <v-menu v-if="isAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn append-icon="mdi-account" color="teal-darken-2" v-bind="props">{{
            user.firstname
          }}</v-btn>
        </template>
        <v-list>
          <v-list-item
            :key="user._id"
            link
            :to="`/employee/${user.firstname}-${user.lastname}/${user._id}`"
          >
            Profile
          </v-list-item>
          <v-list-item @click="logout"> Logout </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="!isAuthenticated" link to="/login" append-icon="mdi-login" class="mr-2" rounded
        >Login</v-btn
      >
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
