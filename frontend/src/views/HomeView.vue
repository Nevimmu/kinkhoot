<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { CardTitle, CardHeader, Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { useGameStore } from '@/stores/game'
import { useNotificationStore } from '@/stores/notification'
import JoinGame from '@/components/JoinGame.vue'

const gameStore = useGameStore()
const router = useRouter()
const notificationStore = useNotificationStore()

onMounted(() => {
	if (notificationStore.message) {
		toast.error('Error', { description: notificationStore.message })

		setTimeout(() => {
			notificationStore.clearNotification()
		}, 5000) // Clear after 5 seconds
	}
})

const createGame = async () => {
	try {
		await gameStore.createGame()
		router.push(`/host/${gameStore.gameCode}`)
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div class="flex flex-col h-screen w-full items-center justify-center">
		<Card class="grid gap-2">
			<CardHeader>
				<CardTitle class="text-center text-4xl">Kinkhoot</CardTitle>
			</CardHeader>
			<CardContent class="grid gap-2">
				<h2 class="text-lg">Join a game</h2>
				<JoinGame />
				<Separator class="mt-2 mb-2" />
				<Button @click="createGame" class="w-full" variant="outline">Create a game</Button>
			</CardContent>
		</Card>
	</div>
</template>
