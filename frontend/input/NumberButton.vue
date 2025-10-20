<template>
  <Card>
    <template #title>
      <p class="text-center font-bold text-xl">{{ number }}</p>
    </template>
    <template #content>
      <div class="grid grid-cols-3">
        <Button
          class="px-2 !rounded-l !rounded-r-none border bg-green"
          @click="emit('score', `${number}`)"
          variant="outlined"
        >
          S
        </Button>
        <Button
          class="px-2 !rounded-none border bg-green"
          @click="emit('score', `D${number}`)"
          variant="outlined"
        >
          D
        </Button>
        <Button
          class="px-2 !rounded-l-none !rounded-r border bg-green"
          @click="emit('score', `T${number}`)"
          variant="outlined"
        >
          T
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from 'primevue'
defineProps<{ number: string }>()

const emit = defineEmits<{
  score: [string]
}>()
</script>
