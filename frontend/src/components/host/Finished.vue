<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
import { vConfetti } from '@neoconfetti/vue'

const playerStore = usePlayerStore()
const height = window.innerHeight
</script>

<template>
	<div v-confetti="{stageHeight: height, particleCount: 300}"/>
	<div class="text-center">
		<h2 class="text-2xl font-bold">Game Finished!</h2>
		<div class="flex flex-col">
			<span v-for="player in playerStore.players" :key="player.score" class="text-2xl">
				{{ player.name }} - {{ player.score }}
			</span>
		</div>
	</div>
</template>
