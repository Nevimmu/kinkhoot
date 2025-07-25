<script setup lang="ts">
import { Progress } from '@/components/ui/progress'

interface Result {
	name: string
	score: number
}

defineProps<{
  results?: Result[]
}>()

const getProgressColorClass = (score: number) => {
  if (score > 75) {
    return 'bg-green-500'
  }
  if (score > 50) {
    return 'bg-yellow-500'
  }
  if (score > 25) {
    return 'bg-orange-500'
  }
  return 'bg-red-500'
}
</script>

<template>
  <div v-for="r in results" :key="r.name" class="grid grid-cols-3 gap-x-2">
    <p class="text-right">{{ r.score }}%</p>
    <div class="flex items-center">
      <Progress :model-value="r.score" :colorClass="getProgressColorClass(r.score)" />
    </div>
    <p>{{ r.name }}</p>
  </div>
</template>
