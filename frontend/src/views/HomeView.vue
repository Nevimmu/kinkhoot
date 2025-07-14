<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CardTitle, CardHeader, Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import JoinGame from '@/components/JoinGame.vue'

const router = useRouter()

const generateRandomCode = (length: number) => {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	const charactersLength = characters.length

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

const createGame = () => {
	// TODO: game creation
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
