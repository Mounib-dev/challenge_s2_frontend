import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    message: '',
    color: '',
    timeout: 5000,
    show: false
  }),
  actions: {
    showSnackbar(message: string, color = '#4CAF50', timeout = 5000) {
      this.message = message
      this.color = color
      this.timeout = timeout
      this.show = true

      setTimeout(() => {
        this.show = false
      }, timeout)
    },
    closeSnackbarManually() {
      this.show = false
    }
  }
})
