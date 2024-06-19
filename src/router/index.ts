import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TeamMembersView from '@/views/TeamMembers/TeamMembersView.vue'
import TeamMembersViewForm from '@/views/TeamMembers/TeamMembersFormView.vue'
import TeamMemberDetailsView from '@/views/TeamMembers/TeamMemberDetailsView.vue'
import Login from '@/views/auth/Login.vue'

import { useAuthStore } from '../stores/auth'
import TeamList from '../views/Teams/TeamList.vue'
import AddTeamForm from '../views/Teams/AddTeamForm.vue'
import EditTeamForm from '../views/Teams/EditTeamForm.vue'

import TasksListView from '../views/Tasks/TasksListView.vue'
import AddTaskView from '../views/Tasks/AddTaskView.vue'
import EditTaskView from '../views/Tasks/EditTaskView.vue'

import WorkloadsView from '../views/Workloads/WorkloadsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/teamMembers',
      name: 'Employees',
      component: TeamMembersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/employees/add',
      name: 'AddNewEmployee',
      component: TeamMembersViewForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/employee/:firstname-:lastname/:id',
      name: 'employeeDetails',
      component: TeamMemberDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/teams',
      name: 'teams',
      component: TeamList,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-team',
      name: 'AddTeamForm',
      component: AddTeamForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-team/:id',
      name: 'EditTeam',
      component: EditTeamForm,
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/task/add',
      name: 'AddTaskForm',
      component: AddTaskView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'TasksList',
      component: TasksListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/task/edit/:id',
      name: 'EditTaskForm',
      component: EditTaskView,
      meta: { requiresAuth: true }
    },
    {
      path: '/workloads',
      name: 'workloads',
      component: WorkloadsView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.token) {
      next({ name: 'Login' })
    } else {
      try {
        await authStore.fetchUser()
        next()
      } catch {
        next({ name: 'Login' })
      }
    }
  } else {
    next()
  }
})

export default router
