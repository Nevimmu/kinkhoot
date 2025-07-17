import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/services/pocketbase'
import type { Player, Round } from '@/types'
import { useGameStore } from './game'
import { usePlayerStore } from './player'

export const useRoundStore = defineStore('round', () => {
	const gameStore = useGameStore()
	const playerStore = usePlayerStore()

	const gameRound = ref<number>(0)
	const roundData = ref<Round | null>()

	const start = async () => {
		try {
			if (!gameStore.gameId) {
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
					game: gameStore.gameId,
					player: r.id,
				})
			}

			newRound()
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
			const round = await pb
				.collection('rounds')
				.getFirstListItem(`roundNumber = "${gameRound.value + 1}" && game = "${gameStore.gameId}"`, {
					expand: 'player',
				})
			roundData.value = {
				number: round.roundNumber,
				player: round.player,
				results: round.expand?.player.results,
			}
			gameRound.value++
		} catch (err) {
			console.log(err)
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
		$reset,
	}
}, { persist: true })
