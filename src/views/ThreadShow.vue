<script setup>
// adding the setup keyword lets you interact with the composition api
import { computed, watch } from 'vue' // reactive can only be used for objects and arrays
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useUsersStore } from '@/stores/UsersStore.js'
import { storeToRefs } from 'pinia'
import AppDate from '@/components/AppDate.vue'
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'

const props = defineProps({
  id: { type: String, required: true }
})

const emit = defineEmits(['ready'])

const threadsStore = useThreadsStore()
const { thread: threadDetails } = storeToRefs(threadsStore)

const postsStore = usePostsStore()
const { posts: postsData } = storeToRefs(postsStore)

const usersStore = useUsersStore()

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

const threadPosts = computed(() => postsData.value.filter((post) => post.threadId === props.id))

// fetch the thread
const thread = await threadsStore.fetchThread(props.id)
// fetch the user
usersStore.fetchUser(thread.userId)
// fetch the posts
const posts = await postsStore.fetchPosts(thread.posts)
// fetch posts users
const users = posts.map((post) => post.userId)
await usersStore.fetchUsers(users)
asyncDataStatus_fetched()

function addPost(eventData) {
  const post = { ...eventData.post, threadId: props.id }

  postsStore.createPost(post)
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ threadDetails(props.id).title }}

      <router-link
        :to="{ name: 'ThreadEdit', params: { id: props.id } }"
        custom
        v-slot="{ navigate }"
      >
        <button @click="navigate" class="btn-green btn-small">Edit Thread</button>
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ threadDetails(props.id).author?.name }}</a
      >, <app-date :timestamp="threadDetails(props.id).publishedAt" />.
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small"
        >{{ threadDetails(props.id).repliesCount }} replies by
        {{ threadDetails(props.id).contributorsCount }} contributors</span
      >
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<style scoped></style>
