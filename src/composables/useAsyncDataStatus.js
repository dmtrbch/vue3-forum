import { ref } from 'vue'

export const useAsyncDataStatus = () => {
  const asyncDataStatus_ready = ref(false)

  const asyncDataStatus_fetched = () => {
    asyncDataStatus_ready.value = true
  }

  return { asyncDataStatus_ready, asyncDataStatus_fetched }
}
