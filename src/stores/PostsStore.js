import { defineStore } from 'pinia'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { useUserStore } from '@/stores/UserStore'
import { fetchItem, fetchItems, findById, makeAppendChildToParent, setItem } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export const usePostsStore = defineStore('PostsStore', {
  state: () => {
    return { posts: [] }
  },
  getters: {},
  actions: {
    async createPost(post) {
      const { authId } = useUserStore()
      post.userId = authId
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      // this.posts.push(post)
      const batch = firebase.firestore().batch()
      const postRef = firebase.firestore().collection('posts').doc()
      const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
      const userRef = firebase.firestore().collection('users').doc(authId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(authId)
      })
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })
      await batch.commit()
      const newPost = await postRef.get()
      // const newPost = await firebase.firestore().collection('posts').add(post)
      // await firebase
      //   .firestore()
      //   .collection('threads')
      //   .doc(post.threadId)
      //   .update({
      //     posts: firebase.firestore.FieldValue.arrayUnion(newPost.id),
      //     contributors: firebase.firestore.FieldValue.arrayUnion(authId)
      //   }) // this method is not safe, the above is more safer

      setItem({ resource: this.posts, item: { ...newPost.data(), id: newPost.id } })

      const { threads } = useThreadsStore()
      this.appendPostToThread(threads, { childId: newPost.id, parentId: post.threadId })
      // const thread = findById(threads, post.threadId)
      // thread.posts = thread.posts || [] // if the thread does not have post property (new thread), set it here
      // thread.posts.push(post.id)
      this.appendContributorToThread(threads, { childId: authId, parentId: post.threadId })
    },
    async updatePost(postId, text) {
      const { authId } = useUserStore()
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: authId,
          moderated: false
        }
      }

      const postRef = firebase.firestore().collection('posts').doc(postId)
      await postRef.update(post)
      const updatedPost = await postRef.get()
      setItem({ resource: this.posts, item: updatedPost })
    },
    fetchPosts(ids) {
      return fetchItems({ ids, emoji: 'Post', resource: this.posts, resourceName: 'posts' })
    },
    fetchPost(id) {
      return fetchItem({ id, emoji: 'Post', resource: this.posts, resourceName: 'posts' })
    },
    appendPostToThread: makeAppendChildToParent('posts'),
    appendContributorToThread: makeAppendChildToParent('contributors')
  }
})
