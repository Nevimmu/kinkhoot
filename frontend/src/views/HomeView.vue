<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CardTitle, CardHeader, Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import JoinGame from '@/components/JoinGame.vue'
import PocketBase from 'pocketbase'

const router = useRouter()
const pb = new PocketBase()

const generateRandomCode = (length: number) => {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	const charactersLength = characters.length

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

const createGame = async () => {
	try {
		const newGameCode = generateRandomCode(6)
		const game = await pb.collection('games').create({
			code: newGameCode,
			status: 'waiting',
			currentRound: 0
		})

		router.push(`/host/${newGameCode}`)
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div class="flex flex-col h-screen w-full items-center justify-center">
		<Card class="grid gap-2">
			<CardHeader>
				<CardTitle class="text-center text-4xl">Kinkoot</CardTitle>
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
