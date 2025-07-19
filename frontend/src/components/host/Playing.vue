<script setup lang="ts">
import { useRoundStore } from '@/stores/round'
import Results from '@/components/Results.vue'

const roundStore = useRoundStore()
</script>

<template>
	<span class="text-center text-xl">Round {{ roundStore.gameRound }} </span>
	<div class="w-lg">
		<Results :results="roundStore.roundData?.results" />
	</div>
</template>
