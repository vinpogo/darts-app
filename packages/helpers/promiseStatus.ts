import { ref } from 'vue'

export const usePromiseStatus = <A, T>(fn: (...args: A[]) => Promise<T>) => {
  const loading = ref(false)
  const execute = (...args: A[]) => {
    try {
      loading.value = true
      return fn(...args)
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    execute,
  }
}
