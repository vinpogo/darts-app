<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Path } from '../../packages/aim/path'
import type { Game } from '../../packages/games/game.types'
import { Field } from '../../packages/types/board'
import ButtonInput from '../input/ButtonsInput.vue'
import Score from '../score/Score.vue'
import { postShotApi, startGameApi } from './game.api'

const game = ref<Game>()
const suggestions = ref<Path>()
const score = computed(() => game.value?.score ?? 0)

const onScore = async (fields: Field[]) => {
  const res = await postShotApi(game.value?.id ?? '', {
    hit: fields[fields.length - 1],
    aim: suggestions.value![fields.length - 1],
  })
  game.value = res.game
  suggestions.value = res.suggestions
}

onMounted(async () => {
  const res = await startGameApi()
  game.value = res.game
  suggestions.value = res.suggestions
})
</script>

<template>
  <div>
    <Score
      :total-score="score"
      :suggestions="suggestions ?? []"
    />
    <ButtonInput
      @score="onScore"
    />
  </div>
</template>
