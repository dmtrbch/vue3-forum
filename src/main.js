import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth';

import {useUserStore} from "@/stores/UserStore.js";

import FontAwesome from '@/plugins/FontAwesome.js'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    useUserStore().fetchAuthUser()
  }
})

const app = createApp(App) // creating vue instance

app.use(createPinia()) // with app.use we are extending our instance before we mount it in the dom
app.use(router) // this is the power of vue 3 and createApp
app.use(FontAwesome)
app.mount('#app') // mount it on a html element

// In Vue 2 it is impossible to isolate some of the functionalities to only one of the vue instances
// without affecting the others

// ex.

// const anotherVueApp = createApp(App)
// anotherVueApp.use(AnotherPlugin)
// anotherVueApp.mount('#another-app')
