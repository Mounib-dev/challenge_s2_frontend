<template>
  <v-responsive>
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
    </v-row>
    <v-card class="w-50 mx-auto">
      <div class="d-flex align-center px-5 py-2">
        <v-btn icon="mdi-pencil" class="mr-3" variant="plain" @click="toggleEdit"></v-btn>
        <h2>{{ employee.firstname }} {{ employee.lastname }}</h2>
        <v-spacer></v-spacer>
        <v-avatar size="80">
          <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
        </v-avatar>
      </div>
      <v-divider></v-divider>
      <v-list>
        <v-list-item prepend-icon="mdi-email" :title="employee.email"> </v-list-item>
        <v-list-item>Poste : {{ employee.jobTitle }}</v-list-item>
      </v-list>
    </v-card>
  </v-responsive>
  <v-responsive v-if="editMode">
    <div class="text-center mt-5">
      <v-btn append-icon="mdi-cancel" color="red" @click="cancelEdit"> Cancel </v-btn>
    </div>
    <v-form class="w-75 mx-auto" @submit.prevent="submitForm">
      <v-text-field
        v-model="newFirstname"
        hide-details="auto"
        label="Firstname"
        name="firstname"
        :rules="[required]"
        type="text"
        class="my-5"
      ></v-text-field>
      <v-text-field
        v-model="newLastname"
        hide-details="auto"
        label="Lastname"
        name="lastname"
        :rules="[required]"
        type="text"
        class="my-5"
      ></v-text-field>
      <v-text-field
        v-model="newEmail"
        hide-details="auto"
        label="Email Adress"
        name="email"
        :rules="[required, email]"
        type="email"
        class="my-5"
      ></v-text-field>

      <v-dialog v-model="dialog" max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn append-icon="mdi-delete" color="red" class="ml-3" v-bind="activatorProps">
            Delete
          </v-btn>
        </template>
        <v-card text="Are you sure you want to delete this employee?" title="CONFIRM">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn color="red" @click="dialog = false"> No </v-btn>

            <v-btn color="green" @click="deleteEmployee" type="submit"> Yes </v-btn>
          </template>
        </v-card>
      </v-dialog>
      <v-btn append-icon="mdi-check-circle" color="green" type="submit"> Edit </v-btn>
    </v-form>
  </v-responsive>
</template>

<script>
import axios from 'axios'
import { useSnackbarStore } from '@/stores/snackbar'
const employeeByIdEndpoint = `https://localhost:3000/api/v1/teammembers?id=`
const editEmployeeEndpoint = `https://localhost:3000/api/v1/teammembers?edit=true&id=`
export default {
  name: 'TeamMemberDetailsCard',
  data: () => ({
    employee: {},
    newFirstname: '',
    newLastname: '',
    newEmail: '',
    required: (value) => !!value || 'Field is required',
    email: (value) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || 'Invalid e-mail.'
    },
    editMode: false,
    dialog: false,
    successMessage: false
  }),
  methods: {
    cancelEdit() {
      return (this.editMode = false)
    },
    toggleEdit() {
      this.newFirstname = this.employee.firstname
      this.newLastname = this.employee.lastname
      this.newEmail = this.employee.email
      return (this.editMode = !this.editMode)
    },
    reloadPage() {
      return window.location.reload()
    },
    async submitForm() {
      const snackbarStore = useSnackbarStore()

      let body = {
        firstname: this.newFirstname,
        lastname: this.newLastname,
        email: this.newEmail
      }
      try {
        const response = await axios.put(editEmployeeEndpoint + this.$route.params.id, body)
        if (response.status === 200) {
          this.editMode = false
          this.successMessage = true
          snackbarStore.showSnackbar('Employee successefuly edited!')
          return this.$router.go(0)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async deleteEmployee() {
      this.dialog = false
      try {
        const response = await axios.delete(employeeByIdEndpoint + this.$route.params.id)
        if (response.status === 204) {
          this.editMode = false
          await this.$router.push('/teamMembers')
        }
      } catch (err) {
        console.error(err)
      }
    }
  },
  async beforeMount() {
    try {
      const employee = await axios.get(employeeByIdEndpoint + this.$route.params.id)
      this.employee = employee.data
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
