<template>
  <v-card class="mx-auto my-10">
    <v-toolbar flat class="px-0 pt-0">
      <v-toolbar-title>Create a new Task</v-toolbar-title>
    </v-toolbar>
    <v-responsive>
      <v-form @submit.prevent="submitForm">
        <v-row class="my-3 mx-auto">
          <v-col cols="12" md="4" sm="6">
            <v-text-field
              v-model="form.title"
              label="Title"
              name="title"
              maxlength="20"
              :error-messages="errors.title"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-text-field
              v-model="form.description"
              label="Description"
              name="description"
              :error-messages="errors.description"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-select
              label="Priority"
              name="priority"
              :items="priorities"
              v-model="form.priority"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-text-field
              v-model="form.deadline"
              type="date"
              :min="minDate"
              :error-messages="errors.deadline"
              label="Deadline"
              name="deadline"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-select
              v-model="form.assignedTo"
              :items="teamMembers"
              item-title="fullName"
              item-value="_id"
              :error-messages="errors.assignedTo"
              label="Assign To"
              name="assignTo"
            ></v-select>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="text" link to="/tasks"> Cancel </v-btn>
          <v-btn type="submit" color="green" variant="text" @click="successDialog"> Save </v-btn>
        </v-card-actions>
      </v-form>
    </v-responsive>

    <!-- Dialog for success message -->
    <v-dialog v-model="successDialog" width="500">
      <v-card>
        <v-card-title class="headline text--green">Success</v-card-title>
        <v-card-text color="green"> The task has been added successfully! </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" link to="/tasks" text @click="successDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { format } from 'date-fns'
export default {
  props: ['teamMembers'],
  data() {
    return {
      form: {
        title: '',
        priority: '',
        deadline: '',
        assignedTo: '',
        description: ''
      },
      successDialog: false,
      priorities: ['Low', 'Medium', 'High'],
      minDate: format(new Date(), 'yyyy-MM-dd'),
      errors: {}
    }
  },
  methods: {
    validateForm() {
      const errors = {}

      if (!this.form.title) {
        errors.title = 'Title is required'
      }
      if (!this.form.priority) {
        errors.priority = 'Priority is required'
      }
      if (!this.form.deadline) {
        errors.deadline = 'Deadline is required'
      }
      if (!this.form.assignedTo) {
        errors.assignedTo = 'You have to assign the task'
      }
      if (!this.form.description) {
        errors.description = 'Description is required'
      }

      this.errors = errors
      return Object.keys(errors).length === 0
    },
    async submitForm() {
      try {
        if (this.validateForm()) {
          this.$emit('submit-task', this.form)

          this.form = {
            title: '',
            priority: '',
            deadline: '',
            assignedTo: '',
            description: ''
          }

          this.successDialog = true
        } else {
          console.log('Form is invalid')
        }
      } catch (error) {
        console.error('There was an error!', error)
      }
    }
  }
}
</script>
