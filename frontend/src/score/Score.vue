<script setup lang="ts">
import { Field } from '../../../shared/types'

type Suggestion = {
  score: Field[]
  longExplanation: string
}
const props = defineProps<{
  totalScore: number
  suggestion: Suggestion
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-9xl font-bold">{{ totalScore }}</h1>
    <div class="flex items-center gap-5">
      <template v-for="sg in suggestion.score" :key="sg">
        <span class="text-2xl">{{ sg }}</span>
      </template>
      <span v-tooltip="suggestion.longExplanation" class="pi pi-question-circle"></span>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss';
@import 'primeicons/primeicons.css';
</style>
