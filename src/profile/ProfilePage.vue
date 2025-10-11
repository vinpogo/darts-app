<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ProfileCreation } from '../../packages/player/profileCreator'
import { getNewProfileApi } from './profile.api'

const profile = ref<ProfileCreation>()
const currentTarget = computed(() => profile.value?.target)

onMounted(async () => {
  profile.value = await getNewProfileApi()
})
</script>

<template>
  <main>
    <h1>{{ currentTarget }}</h1>
  </main>
</template>
