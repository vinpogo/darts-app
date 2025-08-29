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
        <div class="grid ml-auto grid-cols-3 gap-5">
          <Button label="Miss" @click="inputNumber('0')" />
          <Button label="Bull" @click="inputNumber('Bull')" />
          <Button label="DBull" @click="inputNumber('DBull')" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-5">
        <Button label="Submit" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SelectButton, Button, SelectButtonChangeEvent } from 'primevue'
import { ref } from 'vue'
import { Field } from '../../../shared/types'

const props = defineProps<{
  value: Field
}>()

const emit = defineEmits<{
  (e: 'value', field: Field): void
  (e: 'submit'): void
}>()

const numbers = ref(Array.from({ length: 20 }, (_, i) => String(i + 1)))
const multiplier = ref('')
const multiplierOptions = ref([
  { label: 'S', value: '' },
  { label: 'D', value: 'D' },
  { label: 'T', value: 'T' },
])

function inputNumber(number: string) {
  emit('input', (multiplier.value + number) as Field)
}

function changeMultiplier({ value }: SelectButtonChangeEvent) {
  multiplier.value = value

  let temp = props.value
  if (!isBull(temp)) {
    if (temp.startsWith('D') || temp.startsWith('T')) {
      temp = temp.slice(1) as Field
    }
    emit('input', (value + temp) as Field)
  }
}

function isBull(field: Field) {
  return field === 'Bull' || field === 'DBull'
}
function submit() {
  emit('submit')
  // TODO: implement submission logic
}
</script>
