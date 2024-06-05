

<template>
  <v-card width="800">
    <v-form @submit.prevent="submitForm">
      <v-spacer></v-spacer><v-spacer></v-spacer>

      <v-card-text>
        <v-toolbar flat>
          <v-toolbar-title>Create new Task</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="form.title"
                label="Title"
                :error-messages="errors.title"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                label="Priority"
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
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="form.assignedTo"
                :items="teamMembers"
                :error-messages="errors.assignedTo"
                label="assignedTo"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" variant="text" link to="/tasks/list"> Close </v-btn>
        <v-btn type="submit" color="green" variant="text" @click="successDialog"> Save </v-btn>
      </v-card-actions>
    </v-form>

    <!-- Dialog for success message -->
    <v-dialog v-model="successDialog" width="500">
      <v-card>
        <v-card-title color="green" class="headline">Success</v-card-title>
        <v-card-text color="green"> The task has been added successfully! </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" link to="/tasks/list" text @click="successDialog = false">Close</v-btn>
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
        assignedTo: ''
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
        errors.assignedTo = 'Assigned To is required'
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
            assignedTo: ''
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

  

  
  