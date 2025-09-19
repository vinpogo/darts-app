<script setup lang="ts">
import Score from './score/Score.vue'
import ButtonInput from './input/ButtonsInput.vue'
import DartService from './services/DartService'
import { ref } from 'vue'
import { Field, Suggestion } from '../../shared/types'

function handleSubmit() {
  try {
    const toSubmit = suggestion.value.score.map((s, i) => {
      return {
        aim: initialScore.value[i],
        hit: s,
      }
    }, {})
    DartService.submit(toSubmit).then(() => {
      suggestion.value.score.forEach((s) => {
        totalScore.value -= convertScore(s)
      })

      DartService.getSuggestion(totalScore.value).then((data) => {
        suggestion.value.score = data.data.checkout
        suggestion.value.explanation = data.data.explanation
        initialScore.value = data.data.checkout
      })
    })
  } catch {}
}

function convertScore(score: Field) {
  let multiplier = 1
  let actualValue = 0

  if (score.startsWith('T')) {
    multiplier = 3
    actualValue = Number(score.slice(1, score.length))
  } else if (score.startsWith('D')) {
    multiplier = 2
    actualValue = Number(score.slice(1, score.length))
  } else if (score === 'Bull') {
    actualValue = 25
  } else if (score === 'DBull') {
    actualValue = 50
  } else {
    actualValue = Number(score)
  }
  return actualValue * multiplier
}

const totalScore = ref<number>(501)
const initialScore = ref<Field[]>(['T20', 'T20', 'D20'])

const suggestion = ref<Suggestion>({
  score: ['T20', 'T20', 'D20'],
  explanation: "you're just suck",
})
const selectedSuggestion = ref<number>(0)

function selectSuggestion(index: number) {
  selectedSuggestion.value = index
}

function updateResult(field: Field) {
  suggestion.value.score[selectedSuggestion.value] = field
  if (selectedSuggestion.value <= 2) {
    selectedSuggestion.value++
  }
}
</script>

<template>
  <div>
    <Score
      :total-score="totalScore"
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
