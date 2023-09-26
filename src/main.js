import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

import FontAwesome from '@/plugins/FontAwesome.js'

const firebaseConfig = {
  apiKey: 'AIzaSyBAXdbTB3U0vurnooHybQX0Bfi3qba1Kv8',
  authDomain: 'vue-school-forum-3ffae.firebaseapp.com',
  projectId: 'vue-school-forum-3ffae',
  storageBucket: 'vue-school-forum-3ffae.appspot.com',
  messagingSenderId: '1034349237819',
  appId: '1:1034349237819:web:d7363218b0b0fe271a6e1e',
  // apiKey: import.meta.env.VUE_APP_FIREBISE_API_KEY,
  // authDomain: import.meta.env.VUE_APP_FIREBISE_AUTH_DOMAIN,
  // projectId: import.meta.env.VUE_APP_FIREBISE_PROJECT_ID,
  // storageBucket: import.meta.env.VUE_APP_FIREBISE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VUE_APP_FIREBISE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VUE_APP_FIREBISE_APP_ID
}

// eslint-disable-next-line no-unused-vars
firebase.initializeApp(firebaseConfig)

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
