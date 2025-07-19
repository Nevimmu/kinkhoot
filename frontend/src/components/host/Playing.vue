<script setup lang="ts">
import { useRoundStore } from '@/stores/round'
import { useVoteStore } from '@/stores/vote'
import Results from '@/components/Results.vue'
import { onMounted, onUnmounted } from 'vue'

const roundStore = useRoundStore()
const voteStore = useVoteStore()

onMounted(() => {
	voteStore.init()
})

onUnmounted(() => {
	voteStore.unsubscribe()
})
</script>

<template>
	<span class="text-center text-xl">Round {{ roundStore.gameRound }} </span>
	<div class="w-lg">
		<Results :results="roundStore.roundData?.results" />
	</div>
</template>
