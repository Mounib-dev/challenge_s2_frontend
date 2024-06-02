<template>
  <v-card>
    <v-card-title>{{ team.name }}</v-card-title>
    <v-card-subtitle>{{ team.description }}</v-card-subtitle>
    <v-card-text>Created at: {{ formatDate(team.creationDate) }}</v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('show-details', team)">Team details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    team: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style scoped>
.v-card {
  width: 100%;
  margin-bottom: 20px;
}
</style>
