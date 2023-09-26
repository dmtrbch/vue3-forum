<script setup>
import { computed, watch } from 'vue'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { storeToRefs } from 'pinia'
import { useForumsStore } from '@/stores/ForumsStore'
import { useRouter } from 'vue-router'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'

const props = defineProps({
  forumId: { type: String, required: true }
})

const emit = defineEmits(['ready'])

const router = useRouter()

const threadsStore = useThreadsStore()

const forumsStore = useForumsStore()
const { forums } = storeToRefs(forumsStore)

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

await forumsStore.fetchForum(props.forumId)
asyncDataStatus_fetched()

const forum = computed(() => findById(forums.value, props.forumId))
async function save({ title, text }) {
  const thread = { title: title, forumId: props.forumId }
  const newThread = await threadsStore.createThread(thread, text)

  await router.push({ name: 'ThreadShow', params: { id: newThread.id } })
}
function cancel() {
  router.push({ name: 'Forum', params: { id: props.forumId } })
}
</script>

<template>
  <div v-if="asyncDataStatus_ready && forum" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor @save="save" @cancel="cancel" />
  </div>
</template>

<style scoped></style>
