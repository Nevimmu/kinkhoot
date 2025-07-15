<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script>

<template>
	<div class="flex flex-1 flex-col p-5 w-full h-screen items-center justify-center">
		<span class="text-center text-xl">Waiting for game to start</span>
		<span class="text-center">{{ gameStore.player?.name || 'Player' }}</span>
	</div>
</template>
