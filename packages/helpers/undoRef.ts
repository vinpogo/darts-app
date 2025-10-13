import { computed, ref, toRaw, watch } from 'vue'

const isDifferent = <T>(a: T, b: T): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.reduce((res, el, idx) => res && b.indexOf(el) === idx, true)
  }
  return a !== b
}

export const useUndoRef = <T>(initialValue: T) => {
  const value = ref(initialValue)
  const valueWatched = computed(() => toRaw(value.value))

  const stack = ref<T[]>([])
  const canUndo = computed(() => !!stack.value.length)

  let justUndone = false

  watch([valueWatched], (val, oldVal) => {
    console.log(val, oldVal, justUndone)
    if (isDifferent(val, oldVal) && !justUndone) {
      stack.value.push(oldVal)
    }
    justUndone = false
  }, { deep: true })

  const undo = () => {
    console.log('stack', stack.value)
    const val = stack.value.shift()
    if (val === undefined) return
    justUndone = true
    value.value = val
    console.log('undone', value.value)
  }

  return {
    theRef: value,
    canUndo,
    undo,
  }
}
