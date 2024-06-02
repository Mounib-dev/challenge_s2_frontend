// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

interface UserCredentials {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: {}
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },
  actions: {
    async login(credentials: UserCredentials) {
      try {
        const { data } = await axios.post('http://localhost:3000/api/v1/auth/login', credentials)
        this.setToken(data.token)
        router.push({ name: 'Employees' })
      } catch (error) {
        console.error('Invalid login')
      }
    },
    logout() {
      this.clearToken()
      this.user = {}
      router.push({ name: 'Home' })
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },
    async fetchUser() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/v1/auth/user')
        this.user = data.user
      } catch (error) {
        this.clearToken()
        router.push({ name: 'Login' })
      }
    }
  }
})
