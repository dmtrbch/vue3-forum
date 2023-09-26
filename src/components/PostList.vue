<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/UserStore'
import { usePostsStore } from '@/stores/PostsStore.js'
import { ref } from 'vue'
import PostEditor from '@/components/PostEditor.vue'

const props = defineProps({
  posts: { type: Array, required: true }
})

const editing = ref(null)

const { authId, user } = storeToRefs(useUserStore())

const postsStore = usePostsStore()

function userById(userId) {
  return user.value(userId)
}
function toggleEditMode(id) {
  editing.value = id === editing.value ? null : id
}
function handleUpdate(event) {
  postsStore.updatePost(event.post.id, event.post.text)
  editing.value = null
}
</script>

<template>
  <div class="post-list">
    <div v-for="post in props.posts" :key="post.id" class="post">
      <div v-if="userById(post?.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>
        <a href="#">
          <img class="avatar-large" :src="userById(post.userId).avatar" alt="" />
        </a>
        <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>
        <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor @save="handleUpdate" v-if="editing === post.id" :post="post" />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          v-if="post.userId === authId"
          @click.prevent="toggleEditMode(post.id)"
          href="#"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Make a change"
        >
          <fa icon="pencil-alt" />
        </a>
      </div>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
