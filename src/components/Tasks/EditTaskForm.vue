<template>
  <v-card width="800" class="mx-auto my-10">
    <v-form @submit.prevent="submitForm">
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-card-text class="px-0 pt-0">
        <v-toolbar flat>
          <v-toolbar-title>Edit Task</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row class="my-3 mx-auto">
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="editedTask.title"
                label="Title"
                :error-messages="errors.title"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                label="Priority"
                :items="priorities"
                v-model="editedTask.priority"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="editedTask.deadline"
                type="date"
                :min="minDate"
                :error-messages="errors.deadline"
                label="Deadline"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="editedTask.assignedTo"
                :items="teamMembers"
                item-title="fullName"
                item-value="_id"
                :error-messages="errors.assignedTo"
                label="Assigned To"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" variant="text" link to="/tasks"> Cancel </v-btn>
        <v-btn type="submit" color="green" variant="text" @click="successDialog"> Save </v-btn>
      </v-card-actions>
    </v-form>

    <!-- Dialog for success message -->
    <v-dialog v-model="successDialog" width="500">
      <v-card>
        <v-card-title color="green" class="headline">Success</v-card-title>
        <v-card-text color="green"> The task has been Edited successfully! </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" link to="/tasks" text @click="successDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios'
import { format } from 'date-fns'
export default {
  props: ['task', 'teamMembers'],
  data() {
    return {
      editedTask: {},
      successDialog: false,
      priorities: ['Low', 'Medium', 'High'],
      minDate: format(new Date(), 'yyyy-MM-dd'),
      errors: {}
    }
  },
  methods: {
    validateForm() {
      const errors = {}

      if (!this.editedTask.title) {
        errors.title = 'Title is required'
      }
      if (!this.editedTask.priority) {
        errors.priority = 'Priority is required'
      }
      if (!this.editedTask.deadline) {
        errors.deadline = 'Deadline is required'
      }
      if (!this.editedTask.assignedTo) {
        errors.assignedTo = 'Assigned To is required'
      }

      this.errors = errors
      return Object.keys(errors).length === 0
    },
    submitForm() {
      if (this.validateForm()) {
        this.$emit('submit-edited-task', this.editedTask)

        this.successDialog = true
      } else {
        console.log('Form Edit is invalid')
      }
    }
  },
  async beforeMount() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/tasks/${this.$route.params.id}`
      )
      this.editedTask = response.data
      ;(this.editedTask.deadline = format(new Date(this.editedTask.deadline), 'yyyy-MM-dd')),
        console.log(this.editedTask)
    } catch (error) {
      console.error("Erreur lors de la récupération des membres de l'équipe", error)
    }
  }
}
</script>
