<template>
  <v-container>
    <v-row justify="end">
      <v-btn color="darkGreen" class="mb-4" :to="{ path: '/add-team' }">
        <v-icon left>mdi-plus</v-icon>
        New team
      </v-btn>
    </v-row>
    <v-row>
      <v-col v-for="team in teams" :key="team._id" cols="12">
        <team-card
          :team="team"
          @show-details="showTeamDetails"
          @delete-team="confirmDeleteTeam"
        ></team-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Team's Details</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-list-item class="detail-item">
                <v-list-item-content>
                  <v-list-item-title class="detail-title">
                    <strong>Name:</strong> {{ selectedTeam?.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="detail-subtitle">
                    <strong>Description:</strong> {{ selectedTeam?.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="detail-subtitle">
                    <strong>Creation date:</strong> {{ formatDate(selectedTeam?.creationDate) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <v-list-item v-if="selectedTeam?.members?.length">
                <v-list-item-content>
                  <v-list-item-title class="detail-title">
                    <strong>Members:</strong>
                  </v-list-item-title>
                  <v-list>
                    <v-list-item v-for="member in selectedTeam.members" :key="member._id">
                      <v-list-item-avatar>
                        <v-icon>mdi-account-circle</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ member.firstname }} {{ member.lastname }}</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-content>
                  <v-list-item-title class="detail-title">
                    <strong>No members yet! Click the edit button to construct the team.</strong>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row justify="space-between">
            <v-col cols="auto">
              <router-link :to="'/edit-team/' + selectedTeam?._id">
                <v-btn color="secondary"> Edit </v-btn>
              </router-link>
            </v-col>
            <v-col cols="auto">
              <v-btn color="error" @click="confirmDeleteTeam(selectedTeam)">Delete </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="primary" @click="dialogVisible = false">Close</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDeleteDialogVisible" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>Do you really want to delete this team?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteTeam(selectedTeam)">Yes</v-btn>
          <v-btn color="primary" @click="confirmDeleteDialogVisible = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import TeamCard from '@/components/Teams/TeamCard.vue'

export default {
  components: {
    TeamCard
  },
  data() {
    return {
      teams: [],
      dialogVisible: false,
      confirmDeleteDialogVisible: false,
      selectedTeam: null
    }
  },
  created() {
    this.fetchTeams()
  },
  methods: {
    fetchTeams() {
      axios
        .get('http://localhost:3000/api/v1/teams')
        .then((response) => {
          this.teams = response.data
        })
        .catch((error) => {
          console.error('Error fetching teams:', error)
        })
    },
    showTeamDetails(team) {
      this.selectedTeam = team
      this.dialogVisible = true
    },
    confirmDeleteTeam(team) {
      this.selectedTeam = team
      this.confirmDeleteDialogVisible = true
    },
    deleteTeam(team) {
      axios
        .delete(`http://localhost:3000/api/v1/teams/delete/${team._id}`)
        .then(() => {
          this.teams = this.teams.filter((t) => t._id !== team._id)
          this.confirmDeleteDialogVisible = false
          this.dialogVisible = false
        })
        .catch((error) => {
          console.error('Error deleting team:', error)
          this.confirmDeleteDialogVisible = false
        })
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
  }
}
</script>

<style scoped>
.add-team-link {
  text-decoration: none;
  color: #ffffff;
  background-color: #1976d2;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-team-link:hover {
  background-color: #1565c0;
}

.team-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.v-btn--secondary {
  background-color: #1976d2;
  color: #fff;
}

.v-btn--secondary:hover {
  background-color: #1565c0;
}

.v-btn {
  margin: 4px;
}

.v-card {
  transition: box-shadow 0.3s;
}

.v-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.v-list-item-avatar {
  margin-right: 16px;
}

.v-list-item-title {
  font-size: 16px;
}

.headline {
  font-weight: bold;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-title {
  font-size: 18px;
  font-weight: bold;
}

.detail-subtitle {
  font-size: 16px;
  margin-top: 8px;
  color: whitesmoke;
}
</style>
