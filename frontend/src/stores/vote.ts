import { defineStore } from 'pinia'
import { pb } from '@/services/pocketbase'
import { useGameStore } from './game'
import { useRoundStore } from './round'
import { usePlayerStore } from './player'
import type { Vote } from '@/types'

export const useVoteStore = defineStore(
	'vote',
	() => {
		const gameStore = useGameStore()
		const roundStore = useRoundStore()
		const playerStore = usePlayerStore()

		const createVote = async (votedForId: string) => {
			try {
				await pb.collection('votes').create({
					game: gameStore.game?.id,
					voter: playerStore.player?.id,
					voted_for: votedForId,
					round: roundStore.gameRound,
				})
			} catch (err) {
				console.error(err)
			}
		}

		return {
			createVote,
		}
	},
)
