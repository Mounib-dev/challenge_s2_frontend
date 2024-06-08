<template>
  <v-container>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <edit-task-form
      :teamMembers="teamMembers"
      @submit-edited-task="handleTaskEdit"
    ></edit-task-form>
  </v-container>
</template>

<script>
import EditTaskForm from '@/components/Tasks/EditTaskForm.vue'
import axios from 'axios'

export default {
  components: {
    EditTaskForm
  },
  data() {
    return {
      teamMembers: []
    }
  },
  methods: {
    async handleTaskEdit(editedTask) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/v1/tasks/${editedTask._id}`,
          editedTask
        )
        console.log(response)
        console.log(response.status)
        console.log(response.data.message)
      } catch (error) {
        console.error('There was an error editing the task!', error)
      }
    },
    async fetchTeamMembers() {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/teamMembers')
        this.teamMembers = response.data.map((member) => {
          return {
            ...member,
            fullName: `${member.firstname} ${member.lastname}`
          }
        })
        console.log(this.teamMembers)
      } catch (error) {
        console.error("Erreur lors de la récupération des membres de l'équipe", error)
      }
    }
  },
  mounted() {
    this.fetchTeamMembers()
  }
}
</script>
