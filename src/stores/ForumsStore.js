import { defineStore } from 'pinia'
import { fetchItem, fetchItems } from '@/helpers/index.js'

export const useForumsStore = defineStore('ForumsStore', {
  state: () => {
    return { forums: [] }
  },
  getters: {},
  actions: {
    fetchForums(ids) {
      return fetchItems({ ids, emoji: 'Forum', resource: this.forums, resourceName: 'forums' })
    },
    fetchForum(id) {
      return fetchItem({ id, emoji: 'Forum', resource: this.forums, resourceName: 'forums' })
    }
  }
})
