import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useRoundStore } from './round'
import { pb } from '@/services/pocketbase'

export const useGameStore = defineStore(
	'game',
	() => {
		const playerStore = usePlayerStore()
		const roundStore = useRoundStore()
		const gameId = ref<string | null>(null)
		const gameCode = ref<string | null>(null)
		const gameStatus = ref<string | null>(null)
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

		const checkGameCode = async (code: string) => {
			try {
				const game = await pb.collection('games').getFirstListItem(`code="${code}"`)
				gameId.value = game.id
				gameCode.value = game.code
				gameStatus.value = game.status
				return true
			} catch (err) {
				return false
			}
		}

		const createGame = async () => {
			playerStore.$reset()
			roundStore.$reset()
			gameCode.value = _generateRandomCode(6)
			gameStatus.value = 'waiting'

			try {
				const game = await pb.collection('games').create({
					code: gameCode.value,
					status: gameStatus.value,
				})

				gameId.value = game.id
			} catch (err) {
				error.value = (err as Error).message
				throw err
			}
		}

		const start = async () => {
			try {
				if (!gameId.value) {
					throw new Error("gameId isn't set")
				}

				gameStatus.value = 'playing'
				await pb.collection('games').update(gameId.value, { status: gameStatus.value })
			} catch (err) {
				console.error(err)
			}
		}

		const init = async () => {
			try {
				if (!gameId.value) {
					throw new Error("gameId isn't set")
				}

				pb.collection('games').subscribe(gameId.value, (e) => {
					if (e.action === 'update') {
						gameStatus.value = e.record.status
					}
				})
			} catch (err) {
				console.log(err)
			}
		}

		const unsubscribe = async () => {
			try {
				if (!gameId.value) {
					throw new Error("gameId isn't set")
				}

				pb.collection('games').unsubscribe(gameId.value)
			} catch (err) {
				console.error(err)
			}
		}

		return {
			gameId,
			gameCode,
			gameStatus,
			createGame,
			checkGameCode,
			start,
			init,
			unsubscribe,
		}
	},
	{ persist: true },
)
