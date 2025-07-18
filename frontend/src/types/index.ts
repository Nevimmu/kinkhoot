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
