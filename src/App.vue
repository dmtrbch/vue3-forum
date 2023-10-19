<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUserStore } from '@/stores/UserStore.js'
import { useRouter } from 'vue-router'
import AppSpinner from '@/components/AppSpinner.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = useRouter()

NProgress.configure({
  speed: 200,
  showSpinner: false
})
router.beforeEach(() => {
  // showPage.value = false
  NProgress.start()
})

const userStore = useUserStore()

userStore.fetchAuthUser()

function onPageReady() {
  NProgress.done()
}
</script>

<template>
  <the-navbar />
  <div class="container">
    <router-view v-slot="{ Component }" @ready="onPageReady">
      <Suspense timeout="0">
        <div class="container">
          <component :is="Component" />
        </div>
        <template #fallback>
          <app-spinner />
        </template>
      </Suspense>
    </router-view>
    <!--<Suspense>
      <RouterView v-show="showPage" @ready="showPage = true" />
      <div v-show="!showPage" class="push-top">loading...</div>
    </Suspense> -->
  </div>
</template>

<style></style>
