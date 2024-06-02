<template>
  <v-container> <team-member-details-card></team-member-details-card></v-container>
</template>

<script>
import { defineComponent } from 'vue'
import TeamMemberDetailsCard from '@/components/TeamMembers/TeamMemberDetailsCard.vue'
export default defineComponent({
  name: 'TeamMemberDetailsView',
  components: { TeamMemberDetailsCard }
})
</script>
