import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"
import { SearchManyUsersUseCase } from "../search-many-users.js"

export function makeSearchManyUsersUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new SearchManyUsersUseCase(usersRepository)

        return useCase
}