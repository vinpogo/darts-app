<script setup lang="ts">
import { Suggestion } from '../../../shared/types'

const props = defineProps<{
  totalScore: number
  suggestion: Suggestion
  selectedSuggestion: number
}>()

const emit = defineEmits<{
  (e: 'selectSuggestion', index: number): void
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-9xl font-bold">{{ totalScore }}</h1>
    <div class="flex items-center gap-5">
      <template v-for="(sg, index) in suggestion.score" :key="index">
        <span
          class="text-2xl cursor-pointer"
          :class="{ 'text-red-500': selectedSuggestion === index }"
          @click="emit('selectSuggestion', index)"
          >{{ sg }}</span
        >
      </template>
      <span v-tooltip="suggestion.longExplanation" class="pi pi-question-circle"></span>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss';
@import 'primeicons/primeicons.css';
</style>
