import type { GamesRepository } from "@/repositories/games-repository.js"
import type { Game } from "generated/prisma/index.js"

interface CreateGameUseCaseRequest{
    id?: string
    game_name: string
    game_description:string
    release_date: Date
    url_game: string
    url_image_game: string
    developer: string
}

interface CreateGameUseCaseResponse{
    game: Game
}


export class CreateGameUseCase{
    constructor(private gamesRepository: GamesRepository){}

    async execute({game_name, game_description, release_date,url_game,url_image_game, developer}:CreateGameUseCaseRequest): Promise<CreateGameUseCaseResponse> {


        const game = await this.gamesRepository.create({
            game_name,
            game_description,
            release_date,
            url_game,
            url_image_game,
            developer
        })

        return {
            game,
        }
    }
}


