import { prisma } from "@/lib/prisma.js";
import { Prisma, type User } from "generated/prisma/index.js";
import type { UserRepository } from "../users-repository.js";

export class PrismaUserRepository implements UserRepository{
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where:{
                id: id,
            },
        })
        
        return user
    }
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where:{
                email,
            },
        })
        
        return user
    }
    
    async changeRoleToAdmin(user: User) {
        await prisma.user.update({
            where:{
                id: user.id,
            },
            data:{
                role: 'ADMIN'
            }
        })
    }
    
    async create(data: Prisma.UserCreateInput){
        const user = await prisma.user.create({
            data,
        })
        
        return user
    }

    async searchMany(q: string, page: number): Promise<User[]> {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: q,
                },
            },
            take: 20,
            skip: (page -1) * 20,
        })

        return users
    }
}