<script setup>
import { reactive } from 'vue'
import { useUsersStore } from "@/stores/UsersStore.js";
import {useRouter} from "vue-router";

const emit = defineEmits(['ready'])

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: ''
})

const usersStore = useUsersStore()

const router = useRouter()

emit('ready')
async function register() {
  // console.log('submitting form', form)
  await usersStore.registerUserWithEmailAndPassword(form.avatar, form.email, form.name, form.username, form.password)
  await router.push('/')
}
</script>

<template>
  <div class="flex-grid justify-center" style="margin-bottom: 40px">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="form.username" id="username" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="email" class="form-input" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input v-model="form.avatar" id="avatar" type="text" class="form-input" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
