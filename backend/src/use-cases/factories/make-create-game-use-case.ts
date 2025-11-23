import { PrismaGameRepository } from "@/repositories/prisma/prisma-game-repository.js"
import { CreateGameUseCase } from "../create-game-use-case.js"

export function makeCreateGameUseCase() {
        const gamesRepository = new PrismaGameRepository()
        const useCase = new CreateGameUseCase(gamesRepository)

        return useCase
}