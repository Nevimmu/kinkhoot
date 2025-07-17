<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game'
import Results from '@/components/Results.vue'

const gameStore = useGameStore()

onMounted(() => {
	gameStore.init()
})

onUnmounted(() => {
	gameStore.unsubscribe()
})

const startGame = async () => {
	try {
		await gameStore.start()
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<!-- TODO: change the logic on what is seen when -->
	<div class="flex flex-1 flex-col p-5 gap-2 w-full items-center">
		<span class="text-center text-xl">Game code:</span>
		<span class="text-center font-bold text-7xl">{{ gameStore.gameCode }}</span>
		<span class="text-center text-xl">Game state: {{ gameStore.gameStatus }}</span>
		<Button @click="startGame" class="w-xs" :disabled="gameStore.players.length < 2"
			>Start the game</Button
		>
		<div v-if="gameStore.gameStatus == 'waiting'" class="grid grid-cols-2 w-lg">
			<span v-for="player in gameStore.players" class="text-center">
				{{ player.name }}
			</span>
		</div>
		<div v-if="gameStore.gameStatus == 'playing'" class="w-lg">
			<Results :results="gameStore.roundData?.results"/>
		</div>
	</div>
</template>
