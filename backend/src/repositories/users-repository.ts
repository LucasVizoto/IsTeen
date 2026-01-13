import type { Prisma, User } from "generated/prisma/index.js"

export interface UserRepository {
    findById(userId: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    changeRoleToAdmin(user: User): Promise<void>
    create (data: Prisma.UserCreateInput): Promise<User>
    searchMany(q: string, page: number): Promise<User[]>
}