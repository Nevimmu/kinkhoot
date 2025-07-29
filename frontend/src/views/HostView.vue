<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useRoundStore } from '@/stores/round'
import Waiting from '@/components/host/Waiting.vue'
import Playing from '@/components/host/Playing.vue'
import Finished from '@/components/host/Finished.vue'

const gameStore = useGameStore()
const playerStore = usePlayerStore()
const roundStore = useRoundStore()

onMounted(() => {
	gameStore.init()
	playerStore.init()
	roundStore.init()
})

onUnmounted(() => {
	gameStore.unsubscribe()
	playerStore.unsubscribe()
	roundStore.unsubscribe()
})

const startGame = async () => {
	try {
		await gameStore.start()
		await roundStore.start()
		await roundStore.newRound()
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div class="flex flex-1 flex-col p-5 gap-4 w-full h-screen items-center justify-center">
		<div v-if="gameStore.game?.status === 'waiting'">
			<Waiting @start-game="startGame" />
		</div>
		<div v-else-if="gameStore.game?.status === 'playing'">
			<Playing />
		</div>
		<div v-else-if="gameStore.game?.status === 'finished'">
			<Finished />
		</div>
		<div v-else class="text-center">
			<p>Something went wrong</p>
		</div>
	</div>
</template>
