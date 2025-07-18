<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useNotificationStore } from '@/stores/notification'

const playerStore = usePlayerStore()
const gameStore = useGameStore()
const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationStore()

onMounted(async () => {
	const gameCode = route.params.gameCode as string
	if (!gameCode || !(await gameStore.checkGameCode(gameCode))) {
		notificationStore.setNotification("Invalid game code or game doesn't exist.")
		router.push('/')
		return
	}
	gameStore.gameCode = gameCode
})
</script>

<template>
	<div class="flex flex-1 flex-col p-5 w-full h-screen items-center justify-center">
		<span class="text-center text-xl">Waiting for game to start</span>
		<span class="text-center">{{ playerStore.player?.name || 'Player' }}</span>
	</div>
</template>
