<script setup lang="ts">
import { Path } from '../../packages/aim/path'

const props = defineProps<{
  totalScore: number
  suggestions: Path
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-9xl font-bold">{{ totalScore }}</h1>
    <div class="flex text-2xl items-center gap-5">
      <template v-for="(sg, index) in suggestions" :key="index">
        <div>
          {{ sg }}
        </div>
      </template>
    </div>
  </div>
</template>
