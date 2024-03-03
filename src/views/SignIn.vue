<script setup>
import {reactive} from "vue";
import {useUsersStore} from "@/stores/UsersStore.js";
import {useRouter} from "vue-router";

const emit = defineEmits(['ready'])

const form = reactive({
  email: '',
  password: '',
})

const usersStore = useUsersStore()

const router = useRouter()

emit('ready')
async function signIn() {
  try {
    // console.log('submitting form', form)
    await usersStore.signInWithEmailAndPassword(form.email, form.password)
    await router.push('/')
  } catch (error) {
    alert(error.message)
  }

}
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <form @submit.prevent="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="text" class="form-input">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input">
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Create an account?</router-link>
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>