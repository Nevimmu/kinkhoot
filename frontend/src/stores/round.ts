import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/services/pocketbase'
import type { Player, Round, Game } from '@/types'
import { useGameStore } from './game'
import { usePlayerStore } from './player'

export const useRoundStore = defineStore('round', () => {
	const gameStore = useGameStore()
	const playerStore = usePlayerStore()

	const gameRound = ref<number>(0)
	const roundData = ref<Round | null>()

	const start = async () => {
		try {
			if (!gameStore.game?.id) {
				throw new Error("gameId isn't set")
			}

			// Generate rounds
			const rounds: Player[] = []
			for (var p of playerStore.players) {
				rounds.push(p)
			}

			rounds.sort(() => Math.random() - 0.5)

			let roundNb = 0
			for (var r of rounds) {
				roundNb++
				await pb.collection('rounds').create({
					roundNumber: roundNb,
					game: gameStore.game?.id,
					player: r.id,
				})
			}
		} catch (err) {
			console.error(err)
		}
	}

	const newRound = async () => {
		if (gameRound.value == playerStore.players.length) {
			// TODO: handle end of the game
		}

		try {
			// Fetch the next round
			if (!gameStore.game?.id) {
				throw new Error("gameId isn't set")
			}
			const round = await pb
				.collection('rounds')
				.getFirstListItem(
					`roundNumber = "${gameRound.value + 1}" && game = "${gameStore.game?.id}"`,
					{
						expand: 'player',
					},
				)
			roundData.value = {
				id: round.id,
				number: round.roundNumber,
				player: round.player,
				results: round.expand?.player.results,
			}
			gameRound.value++

			await pb.collection('games').update(gameStore.game?.id, { currentRound: gameRound.value })
		} catch (err) {
			console.log(err)
		}
	}

	const init = async () => {
		try {
			if (!gameStore.game?.id) {
				throw new Error("gameId isn't set")
			}

			// Set the current round from the game store
			gameRound.value = gameStore.game.currentRound

			if (gameStore.game.currentRound > 0) {
				// Fetch the current round data
				try {
					const round = await pb
						.collection('rounds')
						.getFirstListItem(
							`roundNumber = "${gameStore.game.currentRound}" && game = "${gameStore.game.id}"`,
						)
					roundData.value = {
						id: round.id,
						number: round.roundNumber,
						player: round.player,
						results: round.expand?.player.results,
					}
				} catch (error) {
					console.log('No round data found for current round.', error)
				}
			}

			// Subscribe to game updates to react to currentRound changes
			pb.collection('games').subscribe(gameStore.game.id, (e) => {
				if (e.action === 'update') {
					const updatedGame = e.record as unknown as Game
					if (updatedGame.currentRound !== gameRound.value) {
						gameRound.value = updatedGame.currentRound
						// Fetch new round data when currentRound changes
						pb.collection('rounds')
							.getFirstListItem(
								`roundNumber = "${gameRound.value}" && game = "${gameStore.game?.id}"`,
								{
									expand: 'player',
								},
							)
							.then((round) => {
								roundData.value = {
									id: round.id,
									number: round.roundNumber,
									player: round.player,
									results: round.expand?.player.results,
								}
							})
							.catch((err) => {
								console.error('Error fetching new round data:', err)
							})
					}
				}
			})
		} catch (err) {
			console.error(err)
		}
	}

	const unsubscribe = async () => {
		try {
			pb.collection('rounds').unsubscribe('*')
		} catch (err) {
			console.error(err)
		}
	}

	const $reset = () => {
		gameRound.value = 0
		roundData.value = null
	}

	return {
		gameRound,
		roundData,
		start,
		newRound,
		init,
		unsubscribe,
		$reset,
	}
})
