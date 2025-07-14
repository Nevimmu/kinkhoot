import { ref } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

export const useGameStore = defineStore('game', () => {
	const pb = new PocketBase()
	const gameId = ref<string | null>(null)
	const gameStatus = ref<string | null>(null)
	const gameRound = ref<number | null>(null)
	const error = ref<string | null>(null)

	const _generateRandomCode = (length: number) => {
		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		const charactersLength = characters.length

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}

		return result
	}

	const createGame = async () => {
		gameId.value = _generateRandomCode(6)
		gameStatus.value = 'waiting'
		gameRound.value = 0

		try {
			await pb.collection('games').create({
				code: gameId.value,
				status: gameStatus.value,
				currentRound: gameRound.value,
			})
		} catch (err) {
			error.value = (err as Error).message
			throw err
		}
	}

	return {
		gameId,
		gameStatus,
		gameRound,
		createGame,
	}
})
