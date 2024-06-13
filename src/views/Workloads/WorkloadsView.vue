<template>
  <v-container> <workloads></workloads></v-container>
</template>

<script>
import { defineComponent } from 'vue'
import Workloads from '@/components/Workloads/Workloads.vue'
export default defineComponent({
  name: 'WorkloadsView',
  components: { Workloads }
})
</script>
