<template>
  <div class="p-5">
    <div class="grid grid-rows-5 grid-cols-5 gap-5">
      <template v-for="number in numbers" :key="number">
        <Button :label="number" @click="inputNumber(number)" />
      </template>
    </div>
    
    <div class="p-5 grid gap-5">
      <div class="flex gap-5">
        <SelectButton
          :model-value="multiplier"
          option-label="label"
          option-value="value"
          @change="changeMultiplier"
          name="selection"
          :options="multiplierOptions"
        />
        <div class="grid ml-auto grid-cols-2 gap-5">
          <Button label="Bull" @click="inputNumber('Bull')" />
          <Button label="DBull" @click="inputNumber('DBull')" />
        </div>
      </div>
      <div  class="grid grid-cols-2 gap-5">
        <Button label="Undo" @click="result.pop()" />
        <Button label="Submit" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SelectButton, Button, SelectButtonChangeEvent } from 'primevue'
import { ref } from 'vue'
import { Field } from '../../../shared/types'

const numbers = ref(Array.from({ length: 20 }, (_, i) => String(i + 1)))
const multiplier = ref('')
const multiplierOptions = ref([
  { label: 'S', value: '' },
  { label: 'D', value: 'D' },
  { label: 'T', value: 'T' },
])

const result = ref<Field[]>([])

function inputNumber(number: string) {
  if (result.value.length >= 3) {
    return
  }
  multiplier.value = ''
  result.value.push((multiplier.value + number) as Field)
}

function changeMultiplier({ value }: SelectButtonChangeEvent) {
  console.log(value)
  multiplier.value = value

  const lastNumber = result.value[result.value.length - 1]
  console.log(lastNumber)
  if (lastNumber && !isBull(lastNumber)) {
    let temp = lastNumber as string
    if (lastNumber.startsWith('D') || lastNumber.startsWith('T')) {
      temp = lastNumber.slice(1)
    }
    result.value[result.value.length - 1] = (value + temp) as Field
  }
}

function isBull(field: Field) {
  return field === 'Bull' || field === 'DBull'
}

function submit() {
  // TODO: implement submission logic
}
</script>
