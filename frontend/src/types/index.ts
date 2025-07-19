export interface Player {
	id: string
	name: string
}

export interface Result {
	name: string
	score: number
}

export interface Round {
	number: number
	player: Player
	results: Result[]
}

export interface Vote {
	voterId: string
	votedForId: string
	roundId: string
}

export interface Game {
	id: string
	code: string
	status: string
	currentRound: number
}
