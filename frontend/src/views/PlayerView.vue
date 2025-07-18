<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
const gameStore = useGameStore()

onMounted(async () => {
	gameStore.init()
	playerStore.init()
})

onUnmounted(() => {
	gameStore.unsubscribe()
	playerStore.unsubscribe()
})
</script>

<template>
	<div class="flex flex-1 flex-col p-5 w-full h-screen items-center justify-center">
		<span class="text-center text-xl">Waiting for game to start</span>
		<span class="text-center">{{ playerStore.player?.name || 'Player' }}</span>
	</div>
</template>
