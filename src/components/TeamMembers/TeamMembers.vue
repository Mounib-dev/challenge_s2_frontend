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
              <h4>{{ item.raw.firstname }} {{ item.raw.lastname }}</h4>
              <v-spacer></v-spacer>
              <v-btn
                :to="`/employee/${item.raw.firstname}-${item.raw.lastname}/${item.raw._id}`"
                variant="text"
                color="teal-darken-2"
                size="large"
              >
                View Profile
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
                  <v-list-item
                    v-if="item.raw.tasks"
                    v-for="task in item.raw.tasks"
                    :title="`${task.title}`"
                  >
                    <v-spacer></v-spacer>
                    {{ task.deadline }}
                    <template v-slot:prepend>
                      <v-icon icon="mdi-clipboard-text-clock"></v-icon>
                    </template>
                    <template v-slot:append>
                      <v-chip :color="priorityColorSetter(task.priority)">{{
                        task.priority
                      }}</v-chip>
                      <v-btn icon="mdi-information" variant="text" color="teal-darken-4"></v-btn>
                    </template>
                  </v-list-item>
                  <v-list-item v-if="item.raw.tasks.length === 0" title="No tasks assigned yet">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-information-outline"></v-icon>
                    </template>
                  </v-list-item>
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
</template>

<script>
import axios from 'axios'
const employeesEndpoint = `http://localhost:3000/api/v1/teammembers?withTasksInformation=true`
export default {
  name: 'TeamMembers',
  data: () => ({
    employees: []
  }),
  methods: {
    priorityColorSetter(priority) {
      if (priority === 'Low') {
        return 'green'
      }
      if (priority === 'Medium') {
        return 'orange'
      }
      if (priority === 'High') {
        return 'red'
      }
    }
  },
  async beforeMount() {
    try {
      const employees = await axios.get(employeesEndpoint)
      console.log(employees.data)
      this.employees = employees.data
      this.employees = this.employees.map((employee) => {
        return {
          ...employee,
          fullName: `${employee.firstname} ${employee.lastname}`,
          tasks: employee.tasks.map((task) => {
            return {
              ...task,
              deadline: new Date(task.deadline)
                .toISOString()
                .split('T')[0]
                .split('-')
                .reverse()
                .join('/')
            }
          })
        }
      })
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
