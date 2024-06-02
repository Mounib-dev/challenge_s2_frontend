<template>
  <div>
    <router-link to="/add-team" class="add-team-link">Add a new team</router-link>
    <div class="team-cards">
      <team-card
        v-for="team in teams"
        :key="team._id"
        :team="team"
        @show-details="showTeamDetails"
        @delete-team="confirmDeleteTeam"
      ></team-card>
    </div>
    <v-dialog v-model="dialogVisible" max-width="600">
      <v-card>
        <v-card-title>Team's details</v-card-title>
        <v-card-text>
          <div><strong>Name :</strong> {{ selectedTeam?.name }}</div>
          <div><strong>Description :</strong> {{ selectedTeam?.description }}</div>
          <div><strong>Date of creation :</strong> {{ formatDate(selectedTeam?.creationDate) }}</div>
          <div><strong>Members :</strong></div>
          <ul>
            <li v-for="member in selectedTeam?.members" :key="member._id">
              {{ member.firstname }} {{ member.lastname }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <router-link :to="'/edit-team/' + selectedTeam?._id" class="v-btn v-btn--secondary">Edit team</router-link>
          <v-btn color="error" @click="confirmDeleteTeam(selectedTeam)">Delete team</v-btn>
          <v-btn color="primary" @click="dialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  
    <v-dialog v-model="confirmDeleteDialogVisible" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>
          Do you really want to delete this team?
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteTeam(selectedTeam)">yes</v-btn>
          <v-btn color="primary" @click="confirmDeleteDialogVisible = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import TeamCard from '@/components/Teams/TeamCard.vue';

export default {
  components: {
    TeamCard,
  },
  data() {
    return {
      teams: [],
      dialogVisible: false,
      confirmDeleteDialogVisible: false,
      selectedTeam: null,
    };
  },
  created() {
    this.fetchTeams();
  },
  methods: {
    fetchTeams() {
      axios.get('http://localhost:3000/api/v1/teams')
        .then(response => {
          this.teams = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des équipes :', error);
        });
    },
    showTeamDetails(team) {
      this.selectedTeam = team;
      this.dialogVisible = true;
    },
    confirmDeleteTeam(team) {
      this.selectedTeam = team;
      this.confirmDeleteDialogVisible = true;
    },
    deleteTeam(team) {
      axios.delete(`http://localhost:3000/api/v1/teams/delete/${team._id}`)
        .then(() => {
          this.teams = this.teams.filter(t => t._id !== team._id);
          this.confirmDeleteDialogVisible = false;
        })
        .catch(error => {
          console.error('Erreur lors de la suppression de l\'équipe :', error);
          this.confirmDeleteDialogVisible = false;
        });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style scoped>
.team-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
