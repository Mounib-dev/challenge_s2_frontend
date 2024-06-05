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
        console.log(editedTask)
        const response = await axios.put(
          `http://localhost:3000/api/v1/tasks/${editedTask._id}`,
          editedTask
        )
        console.log('Task edited successfully!')
      } catch (error) {
        console.error('There was an error editing the task!', error)
      }
    }
  }
}
</script>
