<script setup>
import ThreadList from '@/components/ThreadList.vue'
import { computed, watch } from 'vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { useUsersStore } from '@/stores/UsersStore.js'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'
//import { useCategoriesStore } from "@/stores/CategoriesStore";
//const { fetchAllCategories } = useCategoriesStore() THIS MIGHT BE BETTER WAY OF IMPORTING STUGG

const props = defineProps({
  id: { type: String, required: true }
})

const emit = defineEmits(['ready'])

const forumsStore = useForumsStore()
const { forums: forumsData } = storeToRefs(forumsStore)

const threadsStore = useThreadsStore()
const { thread: threadData } = storeToRefs(threadsStore)

const usersStore = useUsersStore()

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

const forum = await forumsStore.fetchForum(props.id)
const threads = await threadsStore.fetchThreads(forum.threads)
const userIds = threads.map((t) => t.userId)
await usersStore.fetchUsers(userIds)
asyncDataStatus_fetched()

const forumData = computed(() => findById(forumsData.value, props.id))
// const forumThreads = computed(() => threads.value.filter((thread) => thread.forumId === props.id))
const forumThreads = computed(() => {
  if (!forumData.value) return []
  return forumData.value.threads.map((threadId) => threadData.value(threadId)) // we are mutating/creating an array with all the threads that belong to this forum using the thread (threadData) getter inside ThreadsStore
})
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div v-if="forumData" class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forumData.name }}</h1>
          <p class="text-lead">{{ forumData.description }}</p>
        </div>
        <router-link
          :to="{ name: 'ThreadCreate', params: { forumId: forumData.id } }"
          class="btn-green btn-small"
        >
          Start a thread
        </router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="forumThreads" />
    </div>
  </div>
</template>

<style scoped></style>
