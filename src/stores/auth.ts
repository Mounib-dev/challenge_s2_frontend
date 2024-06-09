// src/stores/auth.js
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
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
        const { data, status } = await axios.post(
          'http://localhost:3000/api/v1/auth/login',
          credentials
        )
        if (status === 200) {
          this.setToken(data.token)
          return 'Authentication successful, please wait as you will be redirected'
        }
      } catch (error) {
        console.error('Invalid login')
        if (error.response.status === 401) {
          return error.response.data.message
        }
        if (error.response.status === 404) {
          return error.response.data.message
        }
        return error.response.data.message
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
