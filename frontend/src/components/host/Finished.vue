<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
import { vConfetti } from '@neoconfetti/vue'
import { computed } from 'vue';

const playerStore = usePlayerStore()
const height = window.innerHeight

const sortedPlayers = computed(() => {
  return [...playerStore.players].sort((a, b) => b.score - a.score)
})
</script>

<template>
	<div v-confetti="{stageHeight: height, particleCount: 300}"/>
	<div class="text-center">
		<h2 class="text-2xl font-bold">Game Finished!</h2>
		<div class="flex flex-col">
			<span v-for="player in sortedPlayers" :key="player.name" class="text-2xl">
				{{ player.name }} - {{ player.score }}
			</span>
		</div>
	</div>
</template>
