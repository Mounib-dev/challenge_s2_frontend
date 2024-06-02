<template>
  <v-container> <team-members-form></team-members-form></v-container>
</template>

<script>
import { defineComponent } from 'vue'
import TeamMembersForm from '@/components/TeamMembers/TeamMembersForm.vue'
export default defineComponent({
  name: 'TeamMembersFormView',
  components: { TeamMembersForm }
})
</script>
