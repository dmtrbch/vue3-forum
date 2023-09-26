import { defineStore } from 'pinia'
import { fetchItems, fetchItem } from '@/helpers/index.js'

export const useUsersStore = defineStore('UsersStore', {
  state: () => {
    return {
      users: []
    }
  },
  getters: {},
  actions: {
    fetchUsers(ids) {
      return fetchItems({ ids, emoji: 'User', resource: this.users, resourceName: 'users' })
    },
    fetchUser(id) {
      return fetchItem({ id, emoji: 'User', resource: this.users, resourceName: 'users' })
    }
  }
})
