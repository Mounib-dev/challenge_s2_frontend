<template>
  <v-container>
    <v-card v-if="!loading">
      <v-card-title>
        <v-row justify="space-between" align="center">
          <v-col cols="auto">
            <v-btn icon @click="$router.push('/teams')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <span class="headline">Edit team</span>
          </v-col>
          <v-col cols="auto"></v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="teamName"
            label="Team's Name"
            name="teamName"
            required
          ></v-text-field>
          <v-textarea v-model="teamDescription" label="Description" name="description"></v-textarea>
          <v-text-field
            v-model="creationDate"
            label="Date of Creation"
            name="creationDate"
            type="date"
          ></v-text-field>
          <v-select
            v-model="selectedMembers"
            :items="availableMembers"
            item-title="fullName"
            item-value="_id"
            label="Members"
            multiple
            chips
            closable-chips
            required
          ></v-select>
          <v-btn type="submit" color="primary">Edit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const employeesJoinedTeamEndpoint = `https://localhost:3000/api/v1/teammembers?joinedTeamId=`
    const availableEmployeesEndpoint = `https://localhost:3000/api/v1/teammembers?available=true`

    const route = useRoute()
    const router = useRouter()

    const teamName = ref('')
    const teamDescription = ref('')
    const creationDate = ref('')

    const selectedMembers = ref([])
    const availableMembers = ref([])
    const loading = ref(true)

    const fetchTeam = async () => {
      try {
        const response = await axios.get(`https://localhost:3000/api/v1/teams/${props.id}`)
        const team = response.data
        teamName.value = team.name || ''
        teamDescription.value = team.description || ''
        creationDate.value = team.creationDate ? team.creationDate.split('T')[0] : ''
        selectedMembers.value = team.members.map((member) => {
          return {
            ...member,
            fullName: `${member.firstname} ${member.lastname}`
          }
        })
        loading.value = false
      } catch (error) {
        loading.value = false
        console.error('Error fetching team:', error)
      }
    }

    const fetchMembers = async () => {
      try {
        const response = await axios.get(availableEmployeesEndpoint)
        const members = response.data
        console.log('Response from API:', members)
        availableMembers.value = members.map((member) => {
          return {
            ...member,
            fullName: `${member.firstname} ${member.lastname}`
          }
        })
        console.log('Available members:', availableMembers.value)
      } catch (error) {
        console.error('Error fetching members:', error)
      }
    }

    onMounted(() => {
      fetchTeam()
      fetchMembers()
    })

    const submitForm = async () => {
      try {
        const updatedTeam = {
          name: teamName.value,
          description: teamDescription.value,
          creationDate: creationDate.value,
          members: selectedMembers.value
        }
        const body = {
          newTeamMembersIds: selectedMembers.value
        }
        await axios.put(employeesJoinedTeamEndpoint + route.params.id, body)
        await axios.put(`https://localhost:3000/api/v1/teams/edit/${props.id}`, updatedTeam)
        return router.push({ name: 'teams' })
      } catch (error) {
        console.error('Error updating team:', error)
      }
    }

    return {
      teamName,
      teamDescription,
      creationDate,
      selectedMembers,
      availableMembers,
      loading,
      submitForm
    }
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.v-card {
  max-width: 500px;
  margin: 0 auto;
}

.v-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
}
</style>
