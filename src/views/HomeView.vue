<template>
  <v-container>
    <v-card>
      <v-card-title class="text-center justify-center py-6">
        <h2 class="font-weight-bold text-h2 text-basil">Dashboard</h2>
      </v-card-title>
      <v-card prepend-icon="mdi-account" :title="`Employees : ${tasksCountRef}`">
        <v-card-text>Number of Employees using the workloads planner</v-card-text></v-card
      >
      <v-card prepend-icon="mdi-account-group" :title="`Teams : ${teamsCountRef}`">
        <v-card-text>Number of Teams</v-card-text></v-card
      >
      <v-card prepend-icon="mdi-clipboard-list" :title="`Tasks : ${employeesCountRef}`">
        <v-card-text>Total tasks registred in the app</v-card-text></v-card
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useSnackbarStore } from '../stores/snackbar'
import { useAuthStore } from '@/stores/auth'
const tasksCountEndpoint = 'https://localhost:3000/api/v1/tasks?getCount=true'
const teamsCountEndpoint = 'https://localhost:3000/api/v1/teams?getCount=true'
const employeesCountEndpoint = 'https://localhost:3000/api/v1/teamMembers?getCount=true'
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
    const tasksCountRef: Ref<string | number> = ref('No data available')
    const teamsCountRef: Ref<string | number> = ref('No data available')
    const employeesCountRef: Ref<string | number> = ref('No data available')

    const getCounts = async () => {
      try {
        const [tasksCount, teamsCount, employeesCount] = await Promise.all([
          axios.get(tasksCountEndpoint),
          axios.get(teamsCountEndpoint),
          axios.get(employeesCountEndpoint)
        ])

        tasksCountRef.value = tasksCount.data
        teamsCountRef.value = teamsCount.data
        employeesCountRef.value = employeesCount.data
      } catch (err) {
        console.error(err)
      }
    }
    onMounted(async () => {
      await getCounts()
    })

    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const token = computed(() => authStore.token)

    const isAuthenticated = computed(() => {
      return token.value && user.value
    })

    return {
      user,
      token,
      isAuthenticated,
      tasksCountRef,
      teamsCountRef,
      employeesCountRef,
      getCounts
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
      return snackbarStore.showSnackbar(`Welcome, you are now authenticated`)
    }
    //Code not fonctionning
    if (this.previousPage === '/logout') {
      return snackbarStore.showSnackbar(`Successefuly disconnected!`)
    }
  }
}
</script>

<style></style>
