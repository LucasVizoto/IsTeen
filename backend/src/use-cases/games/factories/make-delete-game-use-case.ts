import { PrismaGameRepository } from "@/repositories/prisma/prisma-game-repository.js"
import { DeleteGameUseCase } from "../delete-game-use-case.js"

export function makeDeleteGameUseCase() {
        const gamesRepository = new PrismaGameRepository()
        const useCase = new DeleteGameUseCase(gamesRepository)

        return useCase
}