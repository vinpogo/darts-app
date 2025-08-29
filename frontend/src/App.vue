<script setup lang="ts">
import Score from './score/Score.vue'
import ButtonInput from './input/ButtonsInput.vue'
import DartService from './services/DartService'
function handleSubmit() {
  try {
    DartService.createRound([])
  } catch {
    
  }
}
</script>

<template>
  <div>
    <Score
      :total-score="501"
      :suggestion="{
        score: ['T20', 'T20', 'D20'],
        longExplanation: 'fuck you',
      }"
    />
    <ButtonInput @submit="handleSubmit"/>
  </div>
</template>

<style>
@import 'tailwindcss';
</style>
