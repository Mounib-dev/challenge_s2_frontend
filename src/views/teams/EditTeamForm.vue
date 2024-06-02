<template>
  <v-container>
    <v-card v-if="!loading">
      <v-card-title>
        <span class="headline">Edit Team</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field v-model="teamName" label="Team's Name" required></v-text-field>
          <v-textarea v-model="teamDescription" label="Description"></v-textarea>
          <v-text-field v-model="creationDate" label="Date of Creation" type="date"></v-text-field>
          <v-autocomplete
            v-model="selectedMembers"
            :items="availableMembers"
            item-text="fullname" 
            item-value="_id" 
            label="Members"
            multiple
            chips
            required
          ></v-autocomplete>
          <v-btn type="submit" color="primary">Edit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const teamName = ref('');
    const teamDescription = ref('');
    const creationDate = ref('');
    const selectedMembers = ref([]);
    const availableMembers = ref([]);
    const initialData = ref({});
    const loading = ref(true);

    onMounted(() => {
      fetchTeam();
      fetchMembers();
    });

    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/teams/${props.id}`);
        const team = response.data;
        teamName.value = team.name || '';
        teamDescription.value = team.description || '';
        creationDate.value = team.creationDate ? team.creationDate.split('T')[0] : '';
        selectedMembers.value = team.members.map(member => member._id) || [];
        initialData.value = {
          name: team.name || '',
          description: team.description || '',
          creationDate: team.creationDate ? team.creationDate.split('T')[0] : '',
          members: team.members.map(member => member._id) || []
        };
        console.log('Team data:', initialData.value);
        loading.value = false;
      } catch (error) {
        console.error('Error fetching team:', error);
        loading.value = false;
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/teammembers');
        console.log('Response from API:', response.data);

        const filteredMembers = response.data.filter(member => member.firstname && member.lastname);

        availableMembers.value = filteredMembers.map(member => ({
          ...member,
          fullname: `${member.firstname} ${member.lastname}`
        }));

        console.log('Available members:', availableMembers.value);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    

    const submitForm = async () => {
      try {
        const updatedTeam = {
          name: teamName.value,
          description: teamDescription.value,
          creationDate: creationDate.value,
          members: selectedMembers.value
        };

        await axios.put(`http://localhost:3000/api/v1/teams/edit/${props.id}`, updatedTeam);
        this.$router.push('/teams');
      } catch (error) {
        console.error('Error updating team:', error);
      }
    };

    return {
      teamName,
      teamDescription,
      creationDate,
      selectedMembers,
      availableMembers,
      initialData,
      loading,
      submitForm
    };
  }
};
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
