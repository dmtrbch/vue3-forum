<script setup>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useRouter } from 'vue-router'
import { findById } from '@/helpers'
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'

const props = defineProps({
  id: { type: String, required: true }
})

const emit = defineEmits(['ready'])

const router = useRouter()

const threadsStore = useThreadsStore()
const { threads } = storeToRefs(threadsStore)

const postsStore = usePostsStore()
const { posts } = storeToRefs(postsStore)

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

const thread = await threadsStore.fetchThread(props.id)
await postsStore.fetchPost(thread.posts[0])
asyncDataStatus_fetched()

const threadData = computed(() => findById(threads.value, props.id))
const text = computed(() => {
  const post = findById(posts.value, threadData.value.posts[0])
  return post ? post.text : ''
})

async function save({ title, text }) {
  const updatedThread = await threadsStore.updateThread(props.id, title, text)

  await router.push({ name: 'ThreadShow', params: { id: updatedThread.id } })
}
function cancel() {
  router.push({ name: 'ThreadShow', params: { id: props.id } })
}
</script>

<template>
  <div v-if="asyncDataStatus_ready && threadData && text" class="col-full push-top">
    <h1>
      Editing <i>{{ threadData.title }}</i>
    </h1>

    <thread-editor :title="threadData.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>

<style scoped></style>
