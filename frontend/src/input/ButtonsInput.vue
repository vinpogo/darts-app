<template>
  <div class="px-5">
    <div class="grid grid-rows-4 grid-cols-5 gap-5 mt-8 mb-12">
      <template v-for="number in numbers" :key="number">
        <NumberButton :number="number" @score="inputNumber" />
      </template>
    </div>

    <div class="flex gap-16">
      <Button class="grow" label="Submit" @click="submit" />
      <div class="grid ml-auto grid-cols-3 gap-5">
        <Button label="Miss" variant="outlined" @click="inputNumber('0')" />
        <Button label="Bull" @click="inputNumber('Bull')" />
        <Button label="DBull" @click="inputNumber('DBull')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import { ref } from 'vue'
import NumberButton from './NumberButton.vue'
import type { Field } from '../../../shared/types'

defineProps<{
  value: Field
}>()

const emit = defineEmits<{
  score: [Field]
  value: [Field]
  submit: [void]
}>()

const numbers = ref(Array.from({ length: 20 }, (_, i) => String(i + 1)))

function inputNumber(number: string) {
  emit('score', number as Field)
}

function submit() {
  emit('submit')
  // TODO: implement submission logic
}
</script>
