import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"
import { RegisterUseCase } from "../register-user-use-case.js"

export function makeRegisterUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new RegisterUseCase(usersRepository)

        return useCase
}