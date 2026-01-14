import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"
import { BecomeAdminUseCase } from "../become-admin-user.js"

export function makeBecomeAdminUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new BecomeAdminUseCase(usersRepository)

        return useCase
}