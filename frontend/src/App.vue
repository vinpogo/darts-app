<script setup lang="ts">
import Score from './score/Score.vue'
import ButtonInput from './input/ButtonsInput.vue'
import DartService from './services/DartService'
import { ref } from 'vue'
import { Field, Suggestion } from '../../shared/types'

function handleSubmit() {
  try {
    DartService.createRound([])
  } catch {}
}

const suggestion = ref<Suggestion>({
  score: ['T20', 'T20', 'D20'],
  longExplanation: 'you`re just suck',
})
const selectedSuggestion = ref<number>(0)

function selectSuggestion(index: number) {
  selectedSuggestion.value = index
}

function updateResult(field: Field) {
  suggestion.value.score[selectedSuggestion.value] = field
}
</script>

<template>
  <div>
    {{ selectedSuggestion }}
    <Score
      :total-score="501"
      :suggestion="suggestion"
      :selected-suggestion="selectedSuggestion"
      @select-suggestion="selectSuggestion"
    />
    <ButtonInput
      :value="suggestion.score[selectedSuggestion]"
      @submit="handleSubmit"
      @input="updateResult"
    />
  </div>
</template>

<style>
@import 'tailwindcss';
</style>
