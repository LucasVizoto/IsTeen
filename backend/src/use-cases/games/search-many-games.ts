import type { GamesRepository } from "@/repositories/games-repository.js"
import type { Game } from "generated/prisma/index.js"

interface SearchManyGamesUseCaseRequest{
    q: string
    page: number
}

interface SearchManyGamesUseCaseResponse{
    games: Game []
}


export class SearchManyGamesUseCase{
    constructor(private gamesRepository:GamesRepository){}

    async execute({q, page }:SearchManyGamesUseCaseRequest): Promise<SearchManyGamesUseCaseResponse> {


        const games = await this.gamesRepository.searchMany(
           q, 
           page
        )

        return {
            games: games,
        }
    }
}


