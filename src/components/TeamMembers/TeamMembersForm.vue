<template>
  <v-card class="w-75 mx-auto">
    <v-row class="mx-5 my-5">
      <v-btn
        link
        class="mt-2"
        to="/teammembers"
        icon="mdi-arrow-left"
        color="darkGreen"
        @click="cancelEdit"
      >
      </v-btn>
      <v-spacer></v-spacer>
      <v-card-title class="center">Register new employee</v-card-title>
    </v-row>
    <v-responsive class="mx-auto" max-width="344">
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="firstname"
          hide-details="auto"
          label="Firstname"
          name="firstname"
          placeholder="Michael"
          :rules="[rules.required]"
          type="text"
          class="my-10"
        ></v-text-field>
        <v-text-field
          v-model="lastname"
          hide-details="auto"
          label="Lastname"
          name="lastname"
          placeholder="Jackson"
          :rules="[rules.required]"
          type="text"
          class="my-10"
        ></v-text-field>
        <v-text-field
          v-model="jobTitle"
          hide-details="auto"
          label="Job Title"
          name="jobTitle"
          placeholder="Developer"
          :rules="[rules.required]"
          type="text"
          class="my-10"
        ></v-text-field>
        <v-text-field
          v-model="email"
          hide-details="auto"
          label="Email Adress"
          name="email"
          placeholder="dev@google.com"
          :rules="[rules.required, rules.email]"
          type="email"
          class="my-10"
        ></v-text-field>
        <v-text-field
          v-model="password"
          hide-details="auto"
          label="Password"
          name="password"
          :rules="[
            rules.required,
            rules.min,
            rules.atLeastOneUpperCase,
            rules.atLeastOneLowerCase,
            rules.atLeastOneNumber,
            rules.atLeastOneSpecialCharacter
          ]"
          type="password"
          class="my-10"
        ></v-text-field>
        <v-btn :loading="loading" size="large" type="submit" variant="elevated" block class="mb-4">
          Add
        </v-btn>
      </v-form>
    </v-responsive>
  </v-card>
</template>

<script>
import axios from 'axios'
import { useSnackbarStore } from '@/stores/snackbar'
const addNewEmployeeEndpoint = 'https://localhost:3000/api/v1/teammembers'
export default {
  data: () => ({
    firstname: '',
    lastname: '',
    jobTitle: '',
    email: '',
    password: '',
    loading: false,
    rules: {
      required: (value) => !!value || 'Field is required',
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
      min: (v) => v.length >= 8 || 'Min 8 characters',
      atLeastOneUpperCase: (v) =>
        /[A-Z]/.test(v) || 'Le mot de passe doit contenir au moins une majuscule',
      atLeastOneLowerCase: (v) =>
        /[a-z]/.test(v) || 'Le mot de passe doit contenir au moins une minuscule',
      atLeastOneNumber: (v) =>
        /[0-9]/.test(v) || 'Le mot de passe doit contenir au moins un chiffre',
      atLeastOneSpecialCharacter: (v) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
        'Le mot de passe doit contenir au moins un caractère spécial'
    }
  }),
  methods: {
    async submitForm(event) {
      const body = {
        firstname: this.firstname,
        lastname: this.lastname,
        jobTitle: this.jobTitle,
        email: this.email,
        password: this.password
      }
      this.loading = true
      try {
        const snackbarStore = useSnackbarStore()
        const response = await axios.post(addNewEmployeeEndpoint, body)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        this.loading = false
        this.firstname = ''
        this.lastname = ''
        this.jobTitle = ''
        this.email = ''
        this.password = ''
        console.log(response)
        snackbarStore.showSnackbar('New employee successefuly added!')
        return this.$router.push('/teamMembers')
      } catch (error) {
        console.error(error)
        console.log(error.message)
        if (error.message === 'Request failed with status code 409') {
          const snackbarStore = useSnackbarStore()
          this.loading = false
          this.email = ''
          return snackbarStore.showSnackbar('Email already exists', '#bd3737')
          // return alert('Email already exists')
        }
      }
    }
  }
}
</script>
