import type { Game } from "generated/prisma/index.js";
import { NotFoundError } from "./errors/not-found-error.js";
import type { GamesRepository } from "@/repositories/games-repository.js";

interface FindGameByIdUseCaseRequest{
    gameId: string
}

interface FindGameByIdUseCaseResponse {
    game: Game
}

export class FindGameByIdUseCase{
    constructor(
        private gameRepository: GamesRepository,
    ) {}

    async execute({gameId}: FindGameByIdUseCaseRequest): Promise<FindGameByIdUseCaseResponse>{

        const user = await this.gameRepository.findById(gameId)

        if (!user){
            throw new NotFoundError()
        }

        return{
            game: user,
        }
    }
}