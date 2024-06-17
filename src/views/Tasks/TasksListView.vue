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

<style>
.v-overlay__scrim {
  pointer-events: auto;
  background: red;
  border-radius: inherit;
  bottom: 0;
  left: 0;
  opacity: var(--v-overlay-opacity, 0.32);
  position: fixed;
  right: 0;
  top: 0;
}
</style>
