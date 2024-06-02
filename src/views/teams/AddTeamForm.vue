<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Add a new team</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="teamName"
            label="Team's name"
            :error-messages="validationErrors.teamName ? 'This field is required' : ''"
            required
          ></v-text-field>
          <v-textarea
            v-model="teamDescription"
            label="Description"
            :error-messages="validationErrors.teamDescription ? 'This field is required' : ''"
            required
          ></v-textarea>
          <v-text-field
            v-model="creationDate"
            label="Date of creation"
            type="date"
            :error-messages="validationErrors.creationDate ? 'This field is required' : ''"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Add</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      teamName: '',
      teamDescription: '',
      creationDate: '',
      validationErrors: {
        teamName: false,
        teamDescription: false,
        creationDate: false,
      }
    };
  },
  methods: {
    validateForm() {
      this.validationErrors.teamName = !this.teamName.trim();
      this.validationErrors.teamDescription = !this.teamDescription.trim();
      this.validationErrors.creationDate = !this.creationDate.trim();

      return !this.validationErrors.teamName && !this.validationErrors.teamDescription && !this.validationErrors.creationDate;
    },
    async submitForm() {
      if (!this.validateForm()) {
        console.error('Erreur : Tous les champs sont obligatoires.');
        return;
      }

      try {
        const newTeam = {
          name: this.teamName,
          description: this.teamDescription,
          creationDate: this.creationDate,
        };
        const response = await axios.post('http://localhost:3000/api/v1/teams/create', newTeam);
        console.log(response.data.message);
        this.resetForm();
        this.$router.push('/teams'); 
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'équipe :', error);
      }
    },
    resetForm() {
      this.teamName = '';
      this.teamDescription = '';
      this.creationDate = '';
      this.validationErrors = {
        teamName: false,
        teamDescription: false,
        creationDate: false,
      };
    },
  },
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
