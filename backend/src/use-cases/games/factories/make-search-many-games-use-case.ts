import { PrismaGameRepository } from "@/repositories/prisma/prisma-game-repository.js"
import { SearchManyGamesUseCase } from "../search-many-games.js"

export function makeSearchManyGamesUseCase() {
        const gamesRepository = new PrismaGameRepository()
        const useCase = new SearchManyGamesUseCase(gamesRepository)

        return useCase
}