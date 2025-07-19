import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pb } from '@/services/pocketbase'
import { useGameStore } from './game'
import { useRoundStore } from './round'
import { usePlayerStore } from './player'
import type { Vote } from '@/types'

export const useVoteStore = defineStore('vote', () => {
	const gameStore = useGameStore()
	const roundStore = useRoundStore()
	const playerStore = usePlayerStore()

	const votes = ref<Vote[] | null>([])

	const createVote = async (votedForId: string) => {
		try {
			await pb.collection('votes').create({
				game: gameStore.game?.id,
				voter: playerStore.player?.id,
				voted_for: votedForId,
				round: roundStore.roundData?.id,
			})
		} catch (err) {
			console.error(err)
		}
	}

	const _checkRoundVotes = async () => {
		try {
			if (!votes.value) return

			let nbVotes = 0

			for (const v of votes.value) {
				if (v.round === roundStore.roundData?.id) {
					nbVotes++
				}
			}

			console.log(nbVotes, playerStore.players.length)
			if (nbVotes === playerStore.players.length) {
				console.log('Everyone voted!')
			}
		} catch (err) {
			console.log(err)
		}
	}

	const init = async () => {
		try {
			if (!gameStore.game?.id) {
				throw new Error("gameId isn't set")
			}

			pb.collection('votes').subscribe(
				'*',
				(e) => {
					if (e.action === 'create') {
						votes.value?.push(e.record as unknown as Vote)
						_checkRoundVotes()
					}
				},
				{ filter: `game = '${gameStore.game?.id}'` },
			)
		} catch (err) {
			console.error(err)
		}
	}

	const unsubscribe = async () => {
		try {
			if (!gameStore.game?.id) {
				throw new Error("gameId isn't set")
			}

			pb.collection('votes').unsubscribe('*')
		} catch (err) {
			console.error(err)
		}
	}

	return {
		createVote,
		init,
		unsubscribe,
		votes,
	}
})
