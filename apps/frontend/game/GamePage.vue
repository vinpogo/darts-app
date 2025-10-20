<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Path } from '../../../packages/aim/path'
import type { Game } from '../../../packages/games/game.types'
import { Field, Miss } from '../../../packages/types/board'
import ButtonInput from '../input/ButtonsInput.vue'
import Score from '../score/Score.vue'
import { postRoundApi, startGameApi } from './game.api'

const game = ref<Game>()
const suggestions = ref<Path>()
const score = computed(() => game.value?.score ?? 0)

const onScore = async (fields: (Field | Miss)[]) => {
  const res = await postRoundApi({
    param: { id: game.value!.id },
    json: fields.map((field) => ({ aim: field, hit: field })),
  })
  game.value = res
}

onMounted(async () => {
  const res = await startGameApi()
  game.value = res
})
</script>

<template>
  <div>
    <Score
      :total-score="score"
      :suggestions="suggestions ?? []"
    />
    <ButtonInput
      @submit="onScore"
    />
  </div>
</template>
