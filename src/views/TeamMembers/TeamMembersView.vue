<template>
  <v-container> <team-members></team-members></v-container>
</template>

<script>
import { defineComponent } from 'vue'
import TeamMembers from '@/components/TeamMembers/TeamMembers.vue'
export default defineComponent({
  name: 'TeamMembersView',
  components: { TeamMembers }
})
</script>
