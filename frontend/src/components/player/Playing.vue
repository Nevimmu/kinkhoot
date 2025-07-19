<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Button } from '@/components/ui/button'
import { usePlayerStore } from '@/stores/player';
import { useRoundStore } from '@/stores/round';
import { useVoteStore } from '@/stores/vote';

const playerStore = usePlayerStore()
const roundStore = useRoundStore()
const voteStore = useVoteStore()

const hasVoted = ref(false)

onMounted(() => {
	playerStore.init()
	roundStore.init()
})

onUnmounted(() => {
	playerStore.unsubscribe()
	roundStore.unsubscribe()
})

const vote = (playerId: string) => {
	if (playerStore.player && roundStore.roundData) {
		voteStore.createVote(playerId)
		hasVoted.value = true
	}
}
</script>

<template>
	<span class="text-center text-xl">Round {{ roundStore.gameRound }} </span>
	<div class="flex flex-col gap-2 p-2">
		<Button @click="vote(p.id)" v-for="p in playerStore.players" :key="p.name" :disabled="hasVoted">{{ p.name }}</Button>
	</div>
</template>
