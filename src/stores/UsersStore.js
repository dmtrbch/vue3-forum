import { defineStore } from 'pinia'
import {fetchItems, fetchItem, setItem} from '@/helpers/index.js'
import {useUserStore} from "@/stores/UserStore.js";
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth';
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
    },
    async registerUserWithEmailAndPassword(avatar = null, email, name, username, password) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await this.createUser(result.user.id, email, name, username, avatar)
      // await useUserStore().fetchAuthUser()
    },
    async signInWithEmailAndPassword(email, password) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signOut() {
      await firebase.auth().signOut()

      useUserStore().authId = null
    },
    async createUser(id, email, name, username, avatar = null){
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()

      const user = { avatar, email, name, username, usernameLower, registeredAt }
      const userRef = await firebase.firestore().collection('users').doc(id)
      userRef.set(user)

      const newUser = await userRef.get()
      setItem({ resource: this.users, item: newUser })

      if (typeof newUser?.data !== 'function') return newUser
      return { ...newUser.data(), id: newUser.id }
    }
  }
})
