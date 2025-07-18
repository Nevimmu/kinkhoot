<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

const emit = defineEmits(['start-game'])

const handleStartGame = () => {
	emit('start-game')
}
</script>

<template>
	<div class="flex flex-col items-center gap-2">
		<span class="text-center text-xl">Game code:</span>
		<span class="text-center font-bold text-7xl">{{ gameStore.gameCode }}</span>
		<Button @click="handleStartGame" class="w-xs" :disabled="playerStore.players.length < 2">
			Start the game
		</Button>
		<div class="grid grid-cols-2 w-lg gap-2 mt-4">
			<span
				v-for="player in playerStore.players"
				:key="player.id"
				class="text-center p-2 bg-muted rounded-md"
			>
				{{ player.name }}
			</span>
		</div>
	</div>
</template>
