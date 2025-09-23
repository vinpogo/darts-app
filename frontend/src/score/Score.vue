<script setup lang="ts">
import type { Suggestion } from '../../../shared/types'
import ProgressSpinner from 'primevue/progressspinner'

defineProps<{
  totalScore: number
  suggestion: Suggestion
  selectedSuggestion: number
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'selectSuggestion', index: number): void
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-9xl font-bold">{{ totalScore }}</h1>
    <template v-if="!loading">
      <div class="flex items-center gap-5">
        <template v-for="(sg, index) in suggestion.score" :key="index">
          <button
            class="text-2xl cursor-pointer"
            :class="{ 'text-red-500': selectedSuggestion === index }"
            @click="emit('selectSuggestion', index)"
          >
            {{ sg }}
          </button>
        </template>
        <!-- <span v-tooltip="suggestion.explanation" class="pi pi-question-circle"></span> -->
      </div>
      <span
        class="text-center"
        :class="{
          'blur-sm animation-pulse': loading,
        }"
      >
        {{ suggestion.explanation }}
      </span>
    </template>
    <ProgressSpinner v-else />
  </div>
</template>

<style>
@import 'tailwindcss';
@import 'primeicons/primeicons.css';
</style>
