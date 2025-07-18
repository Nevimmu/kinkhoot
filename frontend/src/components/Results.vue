<script setup lang="ts">
import { Progress } from '@/components/ui/progress'
interface Result {
	name: string
	score: number
}

const props = defineProps<{
	results?: Result[]
}>()

// TODO: add colors to the values
</script>

<template>
	<div class="grid grid-cols-3 gap-x-2" v-for="r in props.results">
		<p class="text-right">{{ r.score }}%</p>
		<div class="flex items-center">
			<Progress :model-value="r.score" />
		</div>
		<p>{{ r.name }}</p>
	</div>
</template>
