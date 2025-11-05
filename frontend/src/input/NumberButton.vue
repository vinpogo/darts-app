<template>
  <div class="flex flex-col items-center gap-2 border p-2 rounded">
    <b>{{ number }}</b>
    <div>
      <Button
        class="px-2 !rounded-l !rounded-r-none border bg-green"
        @click="emit('score', `${number}`)"
        variant="outlined"
      >
        Single
      </Button>
      <Button
        class="px-2 !rounded-none border bg-green"
        @click="emit('score', `D${number}`)"
        variant="outlined"
      >
        Double
      </Button>
      <Button
        class="px-2 !rounded-l-none !rounded-r border bg-green"
        @click="emit('score', `T${number}`)"
        variant="outlined"
      >
        Triple
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
defineProps<{ number: string }>()

const emit = defineEmits<{
  score: [string]
}>()
</script>
