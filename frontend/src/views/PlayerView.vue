<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import Waiting from '@/components/player/Waiting.vue'
import Playing from '@/components/player/Playing.vue'
import Finished from '@/components/player/Finished.vue'

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
	<div v-if="gameStore.gameStatus === 'waiting'">
		<Waiting />
	</div>
	<div v-else-if="gameStore.gameStatus === 'playing'">
		<Playing />
	</div>
	<div v-else-if="gameStore.gameStatus === 'finished'">
		<Finished />
	</div>
	<div v-else class="text-center">
		<p>Something went wrong</p>
	</div>
</template>
