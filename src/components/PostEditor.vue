<script setup>
import { reactive } from 'vue'

const props = defineProps({
  post: { type: Object, default: () => ({ text: null }) }
})

const postCopy = reactive({ ...props.post })
function save() {
  emit('save', { post: postCopy })

  postCopy.text = ''
}

const emit = defineEmits(['save'])
</script>

<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="postCopy.text"
          id=""
          class="form-input"
          name=""
          rows="10"
          cols="30"
        ></textarea>
      </div>

      <div class="form-actions">
        <button class="btn-blue">{{ props.post.id ? 'Update Post' : 'Submit Post' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
