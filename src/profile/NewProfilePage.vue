<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ProfileCreation } from '../../packages/player/profileCreator'
import { Field, Miss } from '../../packages/types/board'
import ButtonsInput from '../input/ButtonsInput.vue'
import { getNewProfileApi, postContinueProfileApi } from './profile.api'

const profile = ref<ProfileCreation>()
const currentTarget = computed(() => profile.value?.target)

const scores = ref<(Field | Miss)[]>([])
const pushScore = (s: Field | Miss) => scores.value.push(s)

const submitScores = async () => {
  const res = await postContinueProfileApi({
    target: currentTarget.value,
    result: scores.value,
  })
  if (!('target' in res)) return
  profile.value = res
  scores.value = []
}

onMounted(async () => {
  profile.value = await getNewProfileApi()
})
</script>

<template>
  <main>
    <h1 class="text-9xl text-center font-bold">{{ currentTarget }}</h1>
    <h2 class="text-center text-xl h-[1.4rem]">
      <template v-for="score in scores">{{ `${score} ` }} </template>
    </h2>
    <ButtonsInput @score="pushScore" @submit="submitScores" />
  </main>
</template>
