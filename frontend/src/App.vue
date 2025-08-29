<script setup lang="ts">
import { ref, computed } from 'vue'
import DartService, { Round } from './services/DartService'
import Fieldset from 'primevue/fieldset'
import ButtonInput from './input/ButtonsInput.vue'

const games = ref([])

const createRound = async () => {
  try {
    const rounds: Round[] = [
      { aimed: 5, hit: 5 },
      { aimed: 5, hit: 5 },
      { aimed: 5, hit: 5 },
    ]
    const response = await DartService.createRound(rounds)
    games.value.push(response.data)
  } catch (error) {
    console.error('Error creating game:', error)
  }
}

const darts = computed(() => {
  return [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ]
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline">Darts App</h1>
    <Fieldset v-for="dart in darts" :key="dart.id" :legend="`Dart ${dart.id}`">
      <pre>{{ dart.id }}</pre>
    </Fieldset>
    <Button label="play round" @click="createRound" />
    <ButtonInput />
  </div>
</template>

<style>
@import 'tailwindcss';
</style>
