<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { usePlayerStore } from '@/stores/player'
import { useRoundStore } from '@/stores/round'
import { useVoteStore } from '@/stores/vote'

const playerStore = usePlayerStore()
const roundStore = useRoundStore()
const voteStore = useVoteStore()

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
	}
}
</script>

<template>
	<span class="block text-center text-xl">Round {{ roundStore.gameRound }} </span>
	<div class="flex flex-col gap-2 p-2">
		<Button
			class="p-8 text-2xl"
			@click="vote(p.id)"
			v-for="p in playerStore.players"
			:key="p.name"
			:disabled="playerStore.player?.has_voted"
			>{{ p.name }}</Button
		>
	</div>
</template>
