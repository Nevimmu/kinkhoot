<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore()
</script>

<template>
	<div class="text-center">
		<h2 class="text-2xl font-bold">Game Finished!</h2>
		<div class="flex flex-col">
			<span v-for="player in playerStore.players" :key="player.score" class="text-2xl">
				{{ player.name }} - {{ player.score }}
			</span>
		</div>
	</div>
</template>
