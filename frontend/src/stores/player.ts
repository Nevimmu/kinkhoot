import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/services/pocketbase'
import type { Player } from '@/types'
import { useGameStore } from './game'

export const usePlayerStore = defineStore(
	'player',
	() => {
		const player = ref<Player>()
		const players = ref<Player[]>([])
		const gameStore = useGameStore()

		const joinGame = async (name: string, url: string, code: string) => {
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
				if (!gameStore.gameId) {
					throw new Error("gameId isn't set")
				}

				pb.collection('players').subscribe(
					'*',
					(e) => {
						if (e.action === 'create') {
							players.value.push(e.record as unknown as Player)
						}
					},
					{ filter: `game = '${gameStore.gameId}'` },
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
