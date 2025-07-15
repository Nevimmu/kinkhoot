<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore()
</script>

<template>
	<div class="flex flex-1 flex-col p-5 w-full items-center">
		<span class="text-center text-xl">Game code:</span>
		<span class="text-center font-bold text-7xl">{{ gameStore.gameId }}</span>
		<Button class="w-xs">Start the game</Button>
		<div class="grid grid-cols-1 w-lg bg-amber-200">
		</div>
	</div>
</template>
