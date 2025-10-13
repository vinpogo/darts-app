<template>
  <div class="grid gap-4 p-5">
    <div class="flex text-xl gap-2 justify-center h-[46px]">
      <template v-for="(s, i) in scores">
        <button
          class="hover:text-primary hover:border-primary border bg-surface-250 border-transparent rounded-border text-center p-2 cursor-pointer"
          :class="
            {
              'text-primary !border-primary': i === editIndex,
            }
          "
          @click="editIndex = i"
        >
          {{ s }}
        </button>
      </template>
      {{ canUndo }}
      <Button icon="pi-undo" :disabled="!canUndo" @click="undo" />
    </div>
    <div class="grid grid-rows-4 grid-cols-5 gap-5">
      <template v-for="number in numbers" :key="number">
        <NumberButton :number="number" @score="inputNumber" />
      </template>
    </div>

    <div class="flex gap-16">
      <Button class="grow" label="Submit" @click="submit" />
      <div class="grid ml-auto grid-cols-3 gap-5">
        <Button label="Miss" variant="outlined" @click="inputNumber('MISS')" />
        <Button label="Bull" @click="inputNumber('Bull')" />
        <Button label="DBull" @click="inputNumber('DBull')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import { ref } from 'vue'
import { useUndoRef } from '../../packages/helpers/undoRef'
import { Field, Miss } from '../../packages/types/board'
import NumberButton from './NumberButton.vue'

const emit = defineEmits<{
  score: [Field | Miss]
  submit: [void]
}>()

const numbers = ref(Array.from({ length: 20 }, (_, i) => String(i + 1)))

const { theRef: scores, canUndo, undo } = useUndoRef<(Field | Miss)[]>([])
const editIndex = ref<number>()

function inputNumber(number: string) {
  const n = number as (Field | Miss)
  if (editIndex.value != null) {
    scores.value[editIndex.value] = n
    editIndex.value = undefined
  } else {
    scores.value.push(n)
  }
  emit('score', n)
}

function submit() {
  emit('submit')
}
</script>
