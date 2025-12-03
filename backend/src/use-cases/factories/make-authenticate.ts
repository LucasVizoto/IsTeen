import { AuthenticateUseCase } from "../authenticate-user-use-case.js"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"

export function makeAuthenticateUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new AuthenticateUseCase(usersRepository)

        return useCase
}