<script setup>
import ForumList from '@/components/ForumList.vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  categories: { type: Array, required: true }
})

const { forums } = storeToRefs(useForumsStore())

function getForumsForCategory(category) {
  return forums.value.filter((forum) => forum.categoryId === category.id)
}
</script>

<template>
  <forum-list
    v-for="category in props.categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<style scoped></style>
