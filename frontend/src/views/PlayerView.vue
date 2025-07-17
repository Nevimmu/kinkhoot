<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
</script>

<template>
	<div class="flex flex-1 flex-col p-5 w-full h-screen items-center justify-center">
		<span class="text-center text-xl">Waiting for game to start</span>
		<span class="text-center">{{ playerStore.player?.name || 'Player' }}</span>
	</div>
</template>
