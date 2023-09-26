import { defineStore } from 'pinia'
import { useUsersStore } from '@/stores/UsersStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'
import { fetchItem, findById, setItem } from '@/helpers'

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
    }
  },
  getters: {
    authUser: (state) => {
      // const au = this.user()
      // return au(state.authId)
      // how to make use of the user getter instead or rewriting the same code as in
      const user = findById(useUsersStore().users, state.authId)
      if (!user) return null
      return {
        ...user,
        // the get keyword in js allows us to use the following authUser.get, without parenthesis
        get threads() {
          return useThreadsStore().threads.filter((thread) => thread.userId === user.id)
        },
        get posts() {
          return usePostsStore().posts.filter((post) => post.userId === user.id)
        },
        get postsCount() {
          return user.postsCount || 0
        },
        get threadsCount() {
          return user.threads?.length || 0
        }
      }
    },
    user: () => {
      return (id) => {
        const user = findById(useUsersStore().users, id)
        if (!user) return null
        return {
          ...user,
          // the get keyword in js allows us to use the following authUser.get, without parenthesis
          get threads() {
            return useThreadsStore().threads.filter((thread) => thread.userId === user.id)
          },
          get posts() {
            return usePostsStore().posts.filter((post) => post.userId === user.id)
          },
          get postsCount() {
            return user.postsCount || 0
          },
          get threadsCount() {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    fetchAuthUser() {
      const { users } = useUsersStore()
      return fetchItem({ id: this.authId, emoji: 'User', resource: users, resourceName: 'users' })
    },
    updateUser(user) {
      const { users } = useUsersStore()
      setItem({ resource: users, item: user })
    }
  }
})
