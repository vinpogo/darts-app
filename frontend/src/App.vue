<script setup lang="ts">
import Score from './score/Score.vue'
import ButtonInput from './input/ButtonsInput.vue'
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
    <ButtonInput />
  </div>
</template>

<style>
@import 'tailwindcss';
</style>
