<template>
  <v-data-table
    :headers="headers"
    :items="formattedTasks"
    :sort-by="[{ key: 'title', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat class="bg-darkGreen">
        <v-toolbar-title>List Tasks</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn link to="/task/add" class="mb-2" color="white" dark>+ New Task</v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.priority="{ item }">
      <v-chip :color="priorityColor(item.priority)" dark>{{ item.priority }}</v-chip>
    </template>

    <template v-slot:item.assignedTo="{ item }">
      {{ item.assignedTo[0].firstname }} {{ item.assignedTo[0].lastname }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon @click="showInformation(item)" class="mx-2" size="large" color="darkGreen"
        >mdi-eye-outline</v-icon
      >

      <v-dialog v-model="dialog" width="600px">
        <v-card>
          <v-card-title color="bg-darkGreen" class="px-0 pt-0">
            <v-toolbar flat>
              <v-toolbar-title>Task "{{ selectedTask.title }}" Details</v-toolbar-title>
            </v-toolbar>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Title: {{ selectedTask.title }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  Priority:
                  <v-chip :color="priorityColor(selectedTask.priority)" dark>{{
                    item.priority
                  }}</v-chip>
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Deadline: {{ selectedTask.deadline }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title
                  >Responsible: {{ selectedTask.assignedTo[0].firstname }}
                  {{ selectedTask.assignedTo[0].lastname }}</v-list-item-title
                >
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Description: {{ selectedTask.description }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-btn color="white" text @click="dialog = false">Close</v-btn>

            <v-btn color="red" @click="dialogDelete = true">delete</v-btn>
            <v-btn color="green" link :to="`/task/edit/${selectedTask._id}`">edit </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="text-h5">Are you sure you want to delete this task?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="dialogDelete = false">No</v-btn>
            <v-btn color="green" text @click="confirmDelete(selectedTask._id)">Yes</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
import { format } from 'date-fns'
import axios from 'axios'
export default {
  props: ['tasks'],

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogDetail: false,
      taskDeleted: false,
      selectedTask: null,

      headers: [
        { title: 'Title', key: 'title' },
        { title: 'Priority', key: 'priority' },
        { title: 'Deadline', key: 'deadline' },
        { title: 'Responsible', key: 'assignedTo' },
        { title: 'Actions', key: 'actions' }
      ]
    }
  },
  computed: {
    formattedTasks() {
      return this.tasks.map((tasks) => ({
        ...tasks,
        deadline: tasks.deadline ? format(new Date(tasks.deadline), 'dd/MM/yyyy') : ''
      }))
    }
  },
  methods: {
    confirmDelete(id) {
      this.deleteTask(id)
    },
    async deleteTask(id) {
      try {
        await axios.delete(`https://localhost:3000/api/v1/tasks/${id}`)
        this.taskDeleted = true
        window.location.reload()
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    },
    showInformation(selectedItem) {
      this.selectedTask = selectedItem
      this.dialog = true
    },

    priorityColor(priority) {
      switch (priority) {
        case 'High':
          return 'red'
        case 'Medium':
          return 'orange'
        case 'Low':
          return 'green'
        default:
          return 'grey'
      }
    }
  }
}
</script>

<style></style>
