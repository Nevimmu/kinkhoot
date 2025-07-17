import { ref } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

interface Player {
	id: string
	name: string
}

interface Result {
	name: string,
	score: number
}

interface Round {
	number: number
	player: Player
	results: Result[]
}

export const useGameStore = defineStore('game', () => {
	const pb = new PocketBase()
	const gameId = ref<string | null>(null)
	const gameCode = ref<string | null>(null)
	const gameStatus = ref<string | null>(null)
	const gameRound = ref<number>(0)
	const roundData = ref<Round | null>()
	const player = ref<Player>()
	const players = ref<Player[]>([])
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
			await pb.collection('games').getFirstListItem(`code="${code}"`)
			return true
		} catch (err) {
			return false
		}
	}

	const createGame = async () => {
		// TODO: save game data to local storage
		gameCode.value = _generateRandomCode(6)
		gameStatus.value = 'waiting'
		gameRound.value = 0

		try {
			const game = await pb.collection('games').create({
				code: gameCode.value,
				status: gameStatus.value,
				currentRound: gameRound.value,
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

			// Generate rounds
			const rounds: Player[] = []
			for (var p of players.value) {
				rounds.push(p)
			}

			rounds.sort(() => Math.random() - 0.5)

			let roundNb = 0
			for (var r of rounds) {
				roundNb++
				await pb.collection('rounds').create({
					roundNumber: roundNb,
					game: gameId.value,
					player: r.id,
				})
			}

			gameStatus.value = 'playing'
			await pb.collection('games').update(gameId.value, { status: gameStatus.value })

			newRound()
		} catch (err) {
			console.error(err)
		}
	}

	const newRound = async () => {
		if (gameRound.value == players.value.length) {
			// TODO: handle end of the game
		}

		try {
			// Fetch the next round
			const round = await pb
				.collection('rounds')
				.getFirstListItem(`roundNumber = "${gameRound.value + 1}" && game = "${gameId.value}"`, {
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

	const joinGame = async (name: string, url: string, code: string) => {
		try {
			const game = await pb.collection('games').getFirstListItem(`code = '${code}'`)
			const createPlayer = await pb.collection('players').create({
				game: game.id,
				name: name,
				url: url,
				score: 0,
			})

			player.value = <Player>{ id: createPlayer.id, name: createPlayer.name }
		} catch (err) {
			console.log(err)
		}
	}

	const init = async () => {
		// TODO: load game data from local storage
		try {
			if (!gameId.value) {
				throw new Error("gameId isn't set")
			}

			pb.collection('games').subscribe(gameId.value, (e) => {
				if (e.action === 'update') {
					gameStatus.value = e.record.status
					gameRound.value = e.record.currentRound || 0
				}
			})

			pb.collection('players').subscribe(
				'*',
				(e) => {
					if (e.action === 'create') {
						players.value.push(e.record as unknown as Player)
					}
				},
				{ filter: `game = '${gameId.value}'` },
			)
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
			pb.collection('players').unsubscribe('*')
		} catch (err) {
			console.error(err)
		}
	}

	return {
		gameId,
		gameCode,
		gameStatus,
		gameRound,
		createGame,
		checkGameCode,
		joinGame,
		start,
		newRound,
		roundData,
		player,
		players,
		init,
		unsubscribe,
	}
})
