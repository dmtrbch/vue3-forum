import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { fetchItem, fetchItems, setItem } from '@/helpers/index.js'
export const useCategoriesStore = defineStore('CategoriesStore', {
  state: () => {
    return { categories: [] }
  },
  getters: {},
  actions: {
    fetchAllCategories() {
      console.log('🔥', '🏷', 'all')

      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection('categories')
          .onSnapshot((querySnapshot) => {
            const categories = querySnapshot.docs.map((doc) => {
              const category = { id: doc.id, ...doc.data() }
              setItem({ resource: this.categories, item: category })
              return category
            })
            resolve(categories)
          })
      })
    },
    fetchCategories(ids) {
      return fetchItems({
        ids,
        emoji: 'Category',
        resource: this.categories,
        resourceName: 'categories'
      })
    },
    fetchCategory(id) {
      return fetchItem({
        id,
        emoji: 'Category',
        resource: this.categories,
        resourceName: 'categories'
      })
    }
  }
})
