import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/UserStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'
import { fetchItem, fetchItems, findById, makeAppendChildToParent, setItem } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export const useThreadsStore = defineStore('ThreadsStore', {
  state: () => {
    return {
      threads: []
    }
  },
  getters: {
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id)
        if (!thread) return {}

        return {
          ...thread,
          get author() {
            return findById(useUsersStore().users, thread?.userId)
          },
          get repliesCount() {
            return thread?.posts.length - 1
          },
          get contributorsCount() {
            return thread?.contributors?.length || 0
          }
        }
      }
    }
  },
  actions: {
    async createThread(thread, text) {
      const { authId } = useUserStore()
      thread.userId = authId
      thread.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      // this.threads.push(thread)
      const threadRef = firebase.firestore().collection('threads').doc()
      thread.id = threadRef.id
      const userRef = firebase.firestore().collection('users').doc(authId)
      const forumRef = firebase.firestore().collection('forums').doc(thread.forumId)
      const batch = firebase.firestore().batch()

      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      await batch.commit()

      const newThread = await threadRef.get()

      setItem({ resource: this.threads, item: { ...newThread.data(), id: newThread.id } })

      const post = { threadId: thread.id, text }
      const { createPost } = usePostsStore()
      await createPost(post)

      const { users } = useUsersStore()
      this.appendThreadToUser(users, { childId: thread.id, parentId: thread.userId })
      // const user = findById(users, thread.userId)
      // user.threads = user.threads || []
      // user.threads.push(thread.id)

      const { forums } = useForumsStore()
      this.appendThreadToForum(forums, { childId: thread.id, parentId: thread.forumId })
      // const forum = findById(forums, thread.forumId)
      // forum.threads = forum.threads || []
      // forum.threads.push(thread.id)

      return findById(this.threads, thread.id)
    },
    async updateThread(threadId, title, text) {
      const thread = findById(this.threads, threadId)

      const { posts, updatePost } = usePostsStore()
      const post = findById(posts, thread.posts[0])

      let newThread = { ...thread, title }
      let newPost = { ...post, text }

      const threadRef = firebase.firestore().collection('threads').doc(threadId)
      const postRef = firebase.firestore().collection('posts').doc(post.id)
      const batch = firebase.firestore().batch()
      batch.update(threadRef, newThread)
      batch.update(postRef, newPost)
      await batch.commit()

      newThread = await threadRef.get()
      newThread = {
        ...newThread.data(),
        id: newThread.id
      }

      newPost = await postRef.get()
      newPost = {
        ...newPost.data(),
        id: newPost.id
      }

      setItem({ resource: this.threads, item: newThread })
      updatePost(newPost.id, text)

      return newThread
    },
    fetchThreads(ids) {
      return fetchItems({ ids, emoji: 'Thread', resource: this.threads, resourceName: 'threads' })
    },
    fetchThread(id) {
      return fetchItem({ id, emoji: 'Thread', resource: this.threads, resourceName: 'threads' })
    },
    appendThreadToForum: makeAppendChildToParent('threads'),
    appendThreadToUser: makeAppendChildToParent('threads')
  }
})
