import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"
import { GetProfileUseCase } from "../get-user-profile.js"

export function makeGetProfileUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new GetProfileUseCase(usersRepository)

        return useCase
}