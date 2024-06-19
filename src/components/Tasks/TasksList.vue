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
      <v-chip :color="PriorityColor(item.priority)" dark>{{ item.priority }}</v-chip>
    </template>

    <template v-slot:item.assignedTo="{ item }">
      {{ item.assignedTo[0].firstname }} {{ item.assignedTo[0].lastname }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn class="me-2" size="small" color="darkGreen" @click="detailItem(item)">Detail</v-btn>

      <v-dialog v-model="dialogDetail" width="600px">
        <v-card>
          <v-card-title color="#424242" class="px-0 pt-0">
            <v-toolbar flat>
              <v-toolbar-title>Task "{{ detailsItem.title }}" Details</v-toolbar-title>
            </v-toolbar>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Title: {{ detailsItem.title }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  Priority:
                  <v-chip :color="PriorityColor(detailsItem.priority)" dark>{{
                    detailsItem.priority
                  }}</v-chip>
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Deadline: {{ detailsItem.deadline }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title
                  >Responsible: {{ detailsItem.assignedTo[0].firstname }}
                  {{ detailsItem.assignedTo[0].lastname }}</v-list-item-title
                >
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Description: {{ detailsItem.description }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" text @click="closeDetail">Close</v-btn>
            <v-btn color="green" link :to="`/task/edit/${item._id}`" @click="editItem(item)"
              >edit</v-btn
            >

            <v-btn color="red" @click="deleteItem(detailsItem)">delete</v-btn>

            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="text-h5">Are you sure you want to delete this task?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="closeDelete">Close</v-btn>
            <v-btn color="green" text @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-snackbar v-model="taskDeleted" color="success">
        Task deleted <v-btn text @click="taskDeleted = false">Close</v-btn>
      </v-snackbar> -->
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

      headers: [
        { title: 'Title', key: 'title' },
        { title: 'Priority', key: 'priority' },
        { title: 'Deadline', key: 'deadline' },
        { title: 'Responsible', key: 'assignedTo' },
        { title: 'Actions', key: 'actions' }
      ],

      editedIndex: -1,
      editedItem: {
        title: '',
        priority: '',
        deadline: '',
        assignedTo: ''
      },
      detailsItem: {
        title: '',
        priority: '',
        deadline: '',
        assignedTo: ''
      },
      defaultItem: {
        title: '',
        priority: '',
        deadline: '',
        assignedTo: ''
      }
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

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  methods: {
    initialize() {},
    created() {
      this.initialize()
    },
    editItem(item) {
      this.editedItem = { ...item }
    },
    detailItem(item) {
      this.detailsItem = { ...item }

      this.dialogDetail = true
    },

    deleteItem(item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedItem = { ...item }
      this.detailsItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteTask(this.detailsItem._id)
    },
    async deleteTask(id) {
      try {
        await axios.delete(`https://localhost:3000/api/v1/tasks/${id}`)
        this.taskDeleted = true
        this.closeDelete()
        window.location.reload()
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    },

    closeDetail() {
      this.dialogDetail = false
      this.$router.push('/tasks')
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tasks[this.editedIndex], this.editedItem)
      } else {
        this.tasks.push(this.editedItem)
      }
      this.close()
    },
    PriorityColor(priority) {
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
