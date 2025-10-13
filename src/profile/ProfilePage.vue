<script setup lang="ts">
import { Column, DataTable, Panel } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { usePromiseStatus } from '../../packages/helpers/promiseStatus'
import { Profile } from '../../packages/player/profile'
import { Field } from '../../packages/types/board'
import { getProfileApi } from './profile.api'

const profile = ref<Profile>()

const tableData = computed(() =>
  Object.entries(profile.value?.hitRates ?? {})
    .reduce<Record<string, string | number | Record<string, string>>[]>(
      (res, [field, { stats, darts }]) => {
        res.push({
          Target: field,
          Accuracy: `${(stats[field as Field] * 100).toFixed(1)}%`,
          Darts: darts,
          stats: Object.entries(stats).reduce((res, [key, value]) => {
            res[key] = `${(value * 100).toFixed(1)}%`
            return res
          }, {} as Record<string, string>),
        })
        return res
      },
      [],
    )
)
const { execute, loading } = usePromiseStatus(getProfileApi)

onMounted(async () => {
  profile.value = await execute()
})
</script>

<template>
  <main class="p-16 h-screen overflow-y-auto">
    <Panel
      header="Accuracy"
      toggleable
    >
      <template v-if="tableData.length" #default>
        <DataTable
          :loading
          striped-rows
          :value="tableData"
          size="small"
        >
          <Column frozen class="font-bold" field="Target" header="Target" />
          <Column sortable field="Accuracy" header="Accuracy" />
          <Column sortable field="Darts" header="Darts" />
          <template v-for="(_, i) in tableData[0]?.stats" :key="i">
            <Column sortable :field="`stats.${i}`" :header="i" />
          </template>
        </DataTable>
      </template>
    </Panel>
  </main>
</template>
