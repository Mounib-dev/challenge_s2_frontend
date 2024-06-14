<template>
  <v-container>
    <div>
      <h1>Dashboard stats</h1>
    </div>
  </v-container>
  <v-container>
    <v-card prepend-icon="mdi-account" :title="`Employees : ${tasksCount}`">
      <v-card-text>Number of Employees using the workloads planner</v-card-text></v-card
    >
    <v-card prepend-icon="mdi-account-group" :title="`Teams : ${teamsCount}`">
      <v-card-text>Number of Teams</v-card-text></v-card
    >
    <v-card prepend-icon="mdi-clipboard-list" :title="`Tasks : ${employeesCount}`">
      <v-card-text>Total tasks registred in the app</v-card-text></v-card
    >
  </v-container>
</template>

<script lang="ts">
import { computed, onMounted } from 'vue'
import axios from 'axios'
import { useSnackbarStore } from '../stores/snackbar'
import { useAuthStore } from '@/stores/auth'
const tasksCountEndpoint = 'http://localhost:3000/api/v1/tasks?getCount=true'
const teamsCountEndpoint = 'http://localhost:3000/api/v1/teams?getCount=true'
const employeesCountEndpoint = 'http://localhost:3000/api/v1/teamMembers?getCount=true'
export default {
  data() {
    return {
      previousPage: null,
      tasksCount: null || Number,
      teamsCount: null || Number,
      employeesCount: null || Number
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
    },
    async getCounts() {
      try {
        const [tasksCount, teamsCount, employeesCount] = await Promise.all([
          axios.get(tasksCountEndpoint),
          axios.get(teamsCountEndpoint),
          axios.get(employeesCountEndpoint)
        ])

        console.log(tasksCount)
        console.log(teamsCount)
        console.log(employeesCount)

        this.tasksCount = tasksCount.data
        this.teamsCount = teamsCount.data
        this.employeesCount = employeesCount.data
      } catch (err) {
        console.error(err)
      }
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
    this.getCounts()
  }
}
</script>

<style></style>
