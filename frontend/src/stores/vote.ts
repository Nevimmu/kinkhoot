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
			if (!playerStore.player) {
				throw new Error('Player not set')
			}

			await pb.collection('votes').create({
				game: gameStore.game?.id,
				voter: playerStore.player?.id,
				voted_for: votedForId,
				round: roundStore.roundData?.id,
			})

			await pb.collection('players').update(playerStore.player.id, {
				has_voted: true
			}) 
		} catch (err) {
			console.error(err)
		}
	}

	const _resetHasVoted = async () => {
		for (const p of playerStore.players) {
			await pb.collection('players').update(p.id, {
				has_voted: false
			})
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

			if (nbVotes === playerStore.players.length) {
				// Reset the votes
				await _resetHasVoted()
				roundStore.newRound()
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
						const vote: Vote = {
							round: e.record.round,
							voter: e.record.voter,
							voted_for: e.record.voted_for
						}
						votes.value?.push(vote)
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
