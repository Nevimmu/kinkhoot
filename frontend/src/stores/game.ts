import { ref } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

interface Player {
	id: string
	name: string
}

export const useGameStore = defineStore('game', () => {
	const pb = new PocketBase()
	const gameId = ref<string | null>(null)
	const gameStatus = ref<string | null>(null)
	const gameRound = ref<number | null>(null)
	const player = ref<Player>()
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

	const joinGame = async (name: string, url: string, code: string) => {
		try {
			const game = await pb.collection('games').getFirstListItem(`code = '${code}'`)
			const createPlayer = await pb.collection('players').create({
				game: game.id,
				name: name,
				url: url,
				score: 0
			})

			player.value = <Player>{id: createPlayer.id, name: createPlayer.name}

		} catch (err) {
			console.log(err)
		}

	}

	return {
		gameId,
		gameStatus,
		gameRound,
		createGame,
		joinGame,
		player,
	}
})
