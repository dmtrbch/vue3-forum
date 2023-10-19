import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { useUnsubscribesStore } from '@/stores/UnsubscribesStore.js'

export const findById = (resources, id) => {
  if (!resources) return null
  return resources.find((r) => r.id === id)
}

export const makeAppendChildToParent = (child) => {
  return (stateData, { childId, parentId }) => {
    const resource = findById(stateData, parentId)
    if (!resource) {
      console.warn(
        `Appending ${child} to ${stateData} ${parentId} failed because the parent didn't exist`
      )
      return
    }
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}

export const setItem = ({ resource, item }) => {
  const itemIndex = resource.findIndex((i) => i.id === item.id)
  if (item.id && itemIndex !== -1) {
    resource[itemIndex] = item
  } else {
    resource.push(item)
  }
}

export const fetchItem = ({ id, emoji, resource, resourceName }) => {
  console.log('🔥', emoji, id)
  return new Promise((resolve) => {
    const unsubscribe = firebase
      .firestore()
      .collection(resourceName)
      .doc(id)
      .onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        setItem({ resource, item })
        resolve(item)
      })
    useUnsubscribesStore().appendUnsubscribe({ unsubscribe }) // this is the reason why we don't have the user data in the navbar
  })
}

export const fetchItems = ({ ids, emoji, resource, resourceName }) => {
  return Promise.all(ids.map((id) => fetchItem({ id, emoji, resource, resourceName })))
}

export const unsubscribeAllSnapshots = async () => {
  useUnsubscribesStore().unsubscribes.forEach((unsubscribe) => unsubscribe())
  useUnsubscribesStore().clearAllUnsubscribes()
}
