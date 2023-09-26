<script setup>
import ForumList from '@/components/ForumList.vue'
import { computed, watch } from 'vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'

const props = defineProps({
  id: { type: String, required: true }
})

const emit = defineEmits(['ready'])

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const forumsStore = useForumsStore()
const { forums } = storeToRefs(forumsStore)

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

const category = await categoriesStore.fetchCategory(props.id)
await forumsStore.fetchForums(category.forums)
asyncDataStatus_fetched()

const categoryData = computed(() => findById(categories.value, props.id))
function getForumsForCategory(category) {
  return forums.value.filter((forum) => forum.categoryId === category.id)
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <h1>{{ categoryData.name }}</h1>
    </div>

    <forum-list :forums="getForumsForCategory(categoryData)" :title="categoryData.name" />
  </div>
</template>

<style scoped></style>
