<template>
  <v-card color="greenDark">
    <v-card-title class="text-center justify-center py-6">
      <h2 class="font-weight-bold text-h2 text-basil">Workloads</h2>
    </v-card-title>
    <v-tabs v-model="defaultSelectedTab" color="darkGreen" show-arrows>
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
        <v-card-title class="ml-0 pl-0"
          ><v-chip rounded><h2>Members and their tasks</h2></v-chip></v-card-title
        >

        <v-data-iterator :items="team.members">
          <template v-slot:default="{ items }">
            <template v-for="(item, index) in items" :key="index">
              <v-card v-bind="item.raw" class="px-2 py-2">
                {{ item.raw.firstname }} {{ item.raw.lastname }}
                <v-chip class="ml-3" color="darkGreen">{{ item.raw.jobTitle }}</v-chip>
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

              <!-- <div v-for="memberWithTasks in membersWithTasks" :key="memberWithTasks._id">
              <div
                v-if="item.raw._id === memberWithTasks._id"
                v-for="task in memberWithTasks.tasks"
                :key="task._id"
              >
                {{ task.title }} (Priority: {{ task.priority }}) {{ task.deadline }}
              </div>
            </div> -->
            </template>
          </template>
        </v-data-iterator>

        <!-- <div v-for="(member, index) in team.members" :key="member._id">
        {{ member.firstname }} {{ member.lastname }} {{ member._id }} {{ member.jobTitle }}
        Tasks :
        <div v-for="memberWithTasks in membersWithTasks" :key="memberWithTasks._id">
          <div v-if="member._id === memberWithTasks._id">
            <div v-for="task in memberWithTasks.tasks" :key="task._id">
              {{ task.title }} (Priority: {{ task.priority }})
            </div>
          </div>
        </div>
      </div> -->
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
      ]
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
        console.log(membersWithTasks.value)
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
// export default {
//   name: 'Workloads',
//   data: () => ({
//     defaultSelectedTab: 0,
//     teams: [] as Array,
//     membersWithTasksInfo: [] as Array
//   }),
//   async beforeMount() {
//     // const { data } = await axios.get(tasksEndpoint)
//     // const tasks = data
//     // console.log(tasks)

//     const response = await axios.get(teamsEndpoint)
//     const teams = response.data
//     console.log(teams)
//     console.log(teams[0].members)
//     console.log(teams.length)
//     this.teams = teams
//     console.log(this.teams)

//     const teamMembersWithTaksInfo = await axios.get(teamMembersWithTasksInfoEndpoint)
//     console.log(teamMembersWithTaksInfo.data)
//     console.log(teamMembersWithTaksInfo.data[3]._id)
//     this.membersWithTasksInfo = teamMembersWithTaksInfo.data
//     // console.log(this.membersWithTasksInfo[0].tasks)
//     console.log(teams[0].members[0]._id)
//   }
// }
</script>
