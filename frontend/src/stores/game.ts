import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useRoundStore } from './round'
import { pb } from '@/services/pocketbase'
import type { Game } from '@/types'

export const useGameStore = defineStore(
	'game',
	() => {
		const playerStore = usePlayerStore()
		const roundStore = useRoundStore()
		const game = ref<Game | null>(null)
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
				const record = await pb.collection('games').getFirstListItem(`code="${code}"`)
				game.value = record as unknown as Game
				return true
			} catch (err) {
				return false
			}
		}

		const createGame = async () => {
			playerStore.$reset()
			roundStore.$reset()

			const newGameCode = _generateRandomCode(6)

			try {
				const record = await pb.collection('games').create({
					code: newGameCode,
					status: 'waiting',
					currentRound: 0,
				})

				game.value = record as unknown as Game
			} catch (err) {
				error.value = (err as Error).message
				throw err
			}
		}

		const start = async () => {
			try {
				if (!game.value?.id) {
					throw new Error("gameId isn't set")
				}

				await pb.collection('games').update(game.value.id, { status: 'playing' })
			} catch (err) {
				console.error(err)
			}
		}

		const init = async () => {
			try {
				if (!game.value?.id) {
					throw new Error("gameId isn't set")
				}

				pb.collection('games').subscribe(game.value.id, (e) => {
					if (e.action === 'update') {
						game.value = e.record as unknown as Game
					}
				})
			} catch (err) {
				console.log(err)
			}
		}

		const unsubscribe = async () => {
			try {
				if (!game.value?.id) {
					throw new Error("gameId isn't set")
				}

				pb.collection('games').unsubscribe(game.value.id)
			} catch (err) {
				console.error(err)
			}
		}

		return {
			game,
			createGame,
			checkGameCode,
			start,
			init,
			unsubscribe,
		}
	},
	{ persist: true },
)
