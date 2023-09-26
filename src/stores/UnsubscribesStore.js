import { defineStore } from 'pinia'

export const useUnsubscribesStore = defineStore('UnsubscribesStore', {
  state: () => {
    return { unsubscribes: [] }
  },
  getters: {},
  actions: {
    appendUnsubscribe({ unsubscribe }) {
      this.unsubscribes.push(unsubscribe)
    },
    clearAllUnsubscribes() {
      this.unsubscribes = []
    }
  }
})
