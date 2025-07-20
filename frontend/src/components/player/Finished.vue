<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore()
</script>

<template>
	<div class="text-center">
		<h2 class="text-2xl font-bold">Game Finished!</h2>
		<p>Your score:</p>
		<p>{{ playerStore.player?.score }}</p>
	</div>
</template>
