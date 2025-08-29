<script setup lang="ts">
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'
import { computed } from 'vue'

const suggestion1 = computed(() => {
  return 123
})
const suggestion2 = computed(() => {
  return 123
})
const suggestion3 = computed(() => {
  return 123
})

</script>

<template>
  <h1 class="text-3xl font-bold underline">You did it!</h1>
  <div>

    <Fieldset legend="Dart 1">
      {{suggestion1}}
    </Fieldset>
    <Fieldset legend="Dart 2">
      {{suggestion2}}
    </Fieldset>
    <Fieldset legend="Dart 3">
      {{suggestion3}}
    </Fieldset>
  </div>
  
  <Button label="qwe" />
</template>

<style scoped>
@import "tailwindcss";
</style>
