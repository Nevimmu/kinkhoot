export interface Player {
	id: string
	name: string
	score: number
	has_voted: boolean
}

export interface Result {
	name: string
	score: number
}

export interface Round {
	id: string
	number: number
	player: string
	results: Result[]
}

export interface Vote {
	voter: string
	voted_for: string
	round: string
}

export interface Game {
	id: string
	code: string
	status: string
	currentRound: number
}
