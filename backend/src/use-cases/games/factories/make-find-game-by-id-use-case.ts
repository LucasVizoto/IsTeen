import { PrismaGameRepository } from "@/repositories/prisma/prisma-game-repository.js"
import { FindGameByIdUseCase } from "../find-game-by-id-use-case.js"

export function makeFindGameByIdUseCase() {
        const gamesRepository = new PrismaGameRepository()
        const useCase = new FindGameByIdUseCase(gamesRepository)

        return useCase
}