<script setup>
// adding the setup keyword lets you interact with the composition api
import CategoryList from '@/components/CategoryList.vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '@/stores/ForumsStore.js'
import { storeToRefs } from 'pinia' // we need this to make categories reactive object
import { useAsyncDataStatus } from '@/composables/useAsyncDataStatus.js'
import { watch } from 'vue'
import {useUserStore} from "@/stores/UserStore.js";

const emit = defineEmits(['ready'])

const categoriesStore = useCategoriesStore()
const { categories: categoriesData } = storeToRefs(categoriesStore)

const { asyncDataStatus_ready, asyncDataStatus_fetched } = useAsyncDataStatus()
watch(asyncDataStatus_ready, () => {
  emit('ready')
})

const forumsStore = useForumsStore()
/*
categories is no longer reactive because the state that is returned from the store is a reactive object
when destructuring a reactive object its keys become unreactive
* */
const categories = await categoriesStore.fetchAllCategories()
const forumIds = categories.map((category) => category.forums).flat()
await forumsStore.fetchForums(forumIds)

const { authUser } = storeToRefs(useUserStore())
console.log(authUser.value)

asyncDataStatus_fetched()
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="push-top">Welcome to the Forum</h1>
    <category-list :categories="categoriesData" />
  </div>
</template>

<style scoped></style>
