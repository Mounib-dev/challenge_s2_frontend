<template>
  <v-card color="greenDark">
    <v-card-title class="text-center justify-center py-6">
      <h2 class="font-weight-bold text-h2 text-basil">Workloads</h2>
    </v-card-title>
    <v-tabs v-model="defaultSelectedTab" color="green" show-arrows>
      <v-tab
        v-for="(team, index) in teams"
        :key="team._id"
        :value="index"
        prepend-icon="mdi-account-group"
        :text="team.name"
      >
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="defaultSelectedTab">
      <v-tabs-window-item v-for="(team, index) in teams" :key="team" :value="team">
        <v-data-iterator :items="team.members">
          <template v-slot:default="{ items }">
            <template v-for="(item, index) in items" :key="index">
              <v-card v-bind="item.raw" class="px-2 py-2">
                {{ item.raw.firstname }} {{ item.raw.lastname }}
                <v-chip class="ml-3" color="green">{{ item.raw.jobTitle }}</v-chip>
              </v-card>
              <div v-for="memberWithTasks in membersWithTasks" :key="memberWithTasks._id">
                <v-data-table
                  v-if="item.raw._id === memberWithTasks._id"
                  :items="memberWithTasks.tasks"
                  :headers="headers"
                  items-per-page="3"
                  class="my-2"
                  multi-sort
                >
                  <template v-slot:item.priority="{ item }">
                    <v-chip :color="priorityColor(item.priority)" dark>{{ item.priority }}</v-chip>
                  </template>
                </v-data-table>
              </div>
            </template>
          </template>
        </v-data-iterator>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'
const teamsEndpoint = 'https://localhost:3000/api/v1/teams'
// const tasksEndpoint = 'https://localhost:3000/api/v1/tasks'
const teamMembersWithTasksInfoEndpoint =
  'https://localhost:3000/api/v1/teamMembers?withTasksInformation=true'
export default {
  name: 'Workloads',
  data() {
    return {
      headers: [
        {
          align: 'start',
          key: 'title',
          sortable: false,
          title: 'Task'
        },
        {
          align: 'center',
          key: 'priority',
          sortable: true,
          title: 'Priority'
        },
        {
          align: 'center',
          key: 'deadline',
          sortable: true,
          title: 'Deadline'
        }
      ],
      dialog: false
    }
  },
  methods: {
    priorityColor(priority) {
      switch (priority) {
        case 'High':
          return 'red'
        case 'Medium':
          return 'orange'
        case 'Low':
          return 'green'
        default:
          return 'grey'
      }
    }
  },
  setup() {
    const defaultSelectedTab = ref(0)
    const teams = ref([])
    const membersWithTasks = ref([])
    const fetchTeams = async () => {
      try {
        const response = await axios.get(teamsEndpoint)
        teams.value = response.data
        console.log(teams.value)
        console.log(teams.value[0].members)
        console.log(teams.value.length)
        console.log(teams.value)
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    const fetchMembersWithTasksInfo = async () => {
      try {
        const response = await axios.get(teamMembersWithTasksInfoEndpoint)
        membersWithTasks.value = response.data
        membersWithTasks.value = membersWithTasks.value.map((memberWithTasks) => {
          return {
            ...memberWithTasks,
            tasks: memberWithTasks.tasks.map((task) => {
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
        console.log('members with tasks', membersWithTasks.value[0].tasks)
      } catch (error) {
        console.error('Error fetching team members with tasks info:', error)
      }
    }

    onMounted(async () => {
      await fetchTeams()
      await fetchMembersWithTasksInfo()
    })

    return {
      defaultSelectedTab,
      teams,
      membersWithTasks
    }
  }
}
</script>
