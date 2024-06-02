import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TeamMembersView from '@/views/TeamMembers/TeamMembersView.vue'
import TeamMembersViewForm from '@/views/TeamMembers/TeamMembersFormView.vue'
import TeamMemberDetailsView from '@/views/TeamMembers/TeamMemberDetailsView.vue'
import Login from '@/views/auth/Login.vue'

import { useAuthStore } from '../stores/auth'

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
