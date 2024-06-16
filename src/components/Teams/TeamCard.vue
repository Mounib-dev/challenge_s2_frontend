<template>
  <v-card class="team-card" elevation="3">
    <v-card-title class="team-card-title">{{ team.name }}</v-card-title>
    <v-card-subtitle class="pa-3">{{ team.description }}</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text class="pa-3">
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-icon left>mdi-calendar</v-icon>
          Created: {{ formatDate(team.creationDate) }}
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="$emit('show-details', team)">
            <v-icon left>mdi-information</v-icon>
            Details
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
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
.team-card {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
}

.team-card-title {
  background-color:#424242;
  color: white;
  padding: 16px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.v-btn {
  color: white;
}

.v-icon {
  margin-right: 8px;
}
</style>
