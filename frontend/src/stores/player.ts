import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/services/pocketbase'
import type { Player } from '@/types'
import { useGameStore } from './game'
import { useRoundStore } from './round'

export const usePlayerStore = defineStore(
	'player',
	() => {
		const player = ref<Player>()
		const players = ref<Player[]>([])
		const gameStore = useGameStore()
		const playerStore = usePlayerStore()
		const roundStore = useRoundStore()

		const joinGame = async (name: string, url: string, code: string) => {
			playerStore.$reset()
			roundStore.$reset()
			try {
				const game = await pb.collection('games').getFirstListItem(`code = '${code}'`)
				const createdPlayer = await pb.collection('players').create({
					game: game.id,
					name: name,
					url: url,
					score: 0,
				})

				player.value = <Player>{ id: createdPlayer.id, name: createdPlayer.name }
			} catch (err) {
				console.log(err)
			}
		}

		const init = async () => {
			try {
				if (!gameStore.game?.id) {
					throw new Error("gameId isn't set")
				}

				const records = await pb
					.collection('players')
					.getFullList({ filter: `game = '${gameStore.game?.id}'` })
				players.value = records as unknown as Player[]

				pb.collection('players').subscribe(
					'*',
					(e) => {
						if (e.action === 'create') {
							players.value.push(e.record as unknown as Player)
						}
						if (e.action === 'update') {
							const i = players.value.findIndex((p) => p.id === e.record.id)
							if (i !== -1) {
								players.value[i] = e.record as unknown as Player
							}
						}
						if (e.action === 'delete') {
							const i = players.value.findIndex((p) => p.id === e.record.id)
							if (i !== -1) {
								players.value.splice(i, 1)
							}
						}
					},
					{ filter: `game = '${gameStore.game?.id}'` },
				)
			} catch (err) {
				console.log(err)
			}
		}

		const unsubscribe = async () => {
			try {
				pb.collection('players').unsubscribe('*')
			} catch (err) {
				console.error(err)
			}
		}

		const $reset = () => {
			player.value = undefined
			players.value = []
		}

		return {
			player,
			players,
			joinGame,
			init,
			unsubscribe,
			$reset,
		}
	},
	{ persist: true },
)
