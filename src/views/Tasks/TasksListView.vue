<template>
  <v-container>
    <v-responsive>
      <tasks-list :tasks="tasks"></tasks-list>
    </v-responsive>
  </v-container>
</template>



  
  
  
  <script>
import TasksList from '@/components/Tasks/TasksList.vue'

import axios from 'axios'

export default {
  components: {
    TasksList
  },

  data() {
    return {
      tasks: []
    }
  },

  mounted() {
    axios
      .get('http://localhost:3000/api/v1/tasks')
      .then((tasks) => {
        console.log(tasks.data)
        this.tasks = tasks.data
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
  