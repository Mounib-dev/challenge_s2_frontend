<template>
  <v-row>
    <h1 class="mx-auto my-3">Employees</h1>
    <v-spacer></v-spacer>
    <v-btn link to="/employees/add" icon="mdi-account-plus-outline" class="mt-2"></v-btn>
  </v-row>
  <v-data-iterator :items="employees" item-value="firstname" :items-per-page="6">
    <template v-slot:default="{ items, isExpanded, toggleExpand }">
      <v-row>
        <v-col v-for="item in items" :key="item.raw._id" cols="12" md="6" sm="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <!-- <v-icon :color="item.raw.color" :icon="item.raw.icon" size="18" start></v-icon> -->

              <h4>{{ item.raw.firstname }} {{ item.raw.lastname }}</h4>
              <v-spacer></v-spacer>
              <v-btn
                :to="`/employee/${item.raw.firstname}-${item.raw.lastname}/${item.raw._id}`"
                variant="text"
                color="teal-darken-2"
                size="large"
              >
                Show
              </v-btn>
            </v-card-title>

            <v-card-text>
              {{ item.raw.jobTitle }}
            </v-card-text>

            <div class="px-4">
              <v-switch
                :label="`${isExpanded(item) ? 'Hide' : 'Show'} tasks`"
                :model-value="isExpanded(item)"
                density="compact"
                inset
                @click="() => toggleExpand(item)"
              ></v-switch>
            </div>

            <v-divider></v-divider>

            <v-expand-transition>
              <div v-if="isExpanded(item)">
                <v-list :lines="false" density="compact">
                  <v-list-item :title="`🔥 Calories: ${item.raw.calories}`" active></v-list-item>
                  <v-list-item :title="`🍔 Fat: ${item.raw.fat}`"></v-list-item>
                  <v-list-item :title="`🍞 Carbs: ${item.raw.carbs}`"></v-list-item>
                  <v-list-item :title="`🍗 Protein: ${item.raw.protein}`"></v-list-item>
                  <v-list-item :title="`🧂 Sodium: ${item.raw.sodium}`"></v-list-item>
                  <v-list-item :title="`🦴 Calcium: ${item.raw.calcium}`"></v-list-item>
                  <v-list-item :title="`🧲 Iron: ${item.raw.iron}`"></v-list-item>
                </v-list>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
      <div class="d-flex align-center justify-center pa-4">
        <v-btn
          :disabled="page === 1"
          density="comfortable"
          icon="mdi-arrow-left"
          variant="tonal"
          rounded
          @click="prevPage"
        ></v-btn>

        <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>
        <v-btn
          :disabled="page >= pageCount"
          density="comfortable"
          icon="mdi-arrow-right"
          variant="tonal"
          rounded
          @click="nextPage"
        ></v-btn>
      </div>
    </template>
  </v-data-iterator>
  <!-- <v-select
    v-model="tests"
    :items="employees"
    item-title="fullName"
    item-value="_id"
    multiple
  ></v-select>
  <div>{{ tests }}</div> -->
</template>

<script>
import axios from 'axios'
const employeesEndpoint = `http://localhost:3000/api/v1/teammembers`
export default {
  name: 'TeamMembers',
  data: () => ({
    // tests: [],
    employees: [
      // {
      //   id: '6641f1e20f73e38b940c5f10',
      //   firstname: 'Mounib',
      //   lastname: 'Ouroua',
      //   jobTitle: 'Développeur',
      //   email: 'ouroua@dev.io',
      //   tasks: []
      // },
      // {
      //   id: '664208280f73e38b940c5f17',
      //   firstname: 'Yasmine',
      //   lastname: 'Larbi',
      //   jobTitle: 'Développeuse',
      //   email: 'larbi@dev.io',
      //   tasks: []
      // },
      // {
      //   id: '66472aad1bcad9d7a54687d1',
      //   firstname: 'Adama',
      //   lastname: 'Gueye',
      //   jobTitle: 'Développeuse',
      //   email: 'gueye@dev.io',
      //   tasks: []
      // },
      // {
      //   id: '664f9004961057bf267dc437',
      //   firstname: 'Michael',
      //   lastname: 'Jackson',
      //   jobTitle: 'Chanteur',
      //   email: 'michael@jackson.io',
      //   tasks: []
      // }
    ]
  }),
  async beforeMount() {
    console.log(employeesEndpoint)
    try {
      const employees = await axios.get(employeesEndpoint)
      console.log(employees.data)
      this.employees = employees.data
      this.employees = this.employees.map((employee) => {
        return {
          ...employee,
          fullName: `${employee.firstname} ${employee.lastname}`
        }
      })
      console.log(this.employees)
      console.log(this.employees[0])
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
