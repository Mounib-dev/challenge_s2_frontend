

<template>
  <v-container>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <add-task-form @submit-task="handleTaskSubmit" :teamMembers="teamMembers"></add-task-form>
  </v-container>
</template>

<script>
import AddTaskForm from '@/components/Tasks/AddTaskForm.vue'
import axios from 'axios'

export default {
  components: {
    AddTaskForm
  },
  data() {
    return {
      tasks: [],
      teamMembers: []
    }
  },
  methods: {
    async handleTaskSubmit(task) {
      try {
        const body = task
        const response = await axios.post('http://localhost:3000/api/v1/tasks', body)
        this.tasks.push(task)
      } catch (error) {
        console.error('There was an error submitting the task!', error)
      }
    },
    async fetchTeamMembers() {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/teamMembers')
        this.teamMembers = response.data
        console.log(this.teamMembers)
      } catch (error) {
        console.error("Erreur lors de la récupération des membres de l'équipe", error)
      }
    },
    getTeamMemberName(id) {
      const member = this.teamMembers.find((member) => member._id === id)
      console.log(member.firstname)
      return member ? member.firstname : 'Unknown'
    }
  },

  mounted() {
    this.fetchTeamMembers()
  }
}
</script>


