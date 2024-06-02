<!-- src/components/Snackbar.vue -->
<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" class="custom-snackbar">
    <span class="snackbar-text">{{ message }}</span>
    <template v-slot:actions>
      <v-btn color="black" variant="text" @click="closeManually"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { computed } from 'vue'
import { useSnackbarStore } from '../../stores/snackbar'

export default {
  setup() {
    const snackbarStore = useSnackbarStore()

    return {
      show: computed(() => snackbarStore.$state.show),
      message: computed(() => snackbarStore.$state.message),
      color: computed(() => snackbarStore.$state.color),
      timeout: computed(() => snackbarStore.$state.timeout),
      closeManually: snackbarStore.closeSnackbarManually
    }
  }
}
</script>

<style scoped>
.custom-snackbar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  color: black;
}
.snackbar-text {
  color: black;
}

.v-overlay {
  max-height: 125px;
}

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
