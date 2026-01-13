import { type User, type Prisma, Role } from "generated/prisma/index.js";
import type { UserRepository } from "../users-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UserRepository{
    
    public items: User[] = []
    
    async findById(userId: string): Promise<User | null> {
        const user = this.items.find((item) => item.id == userId)
        
        if (!user){
            return null
        }

        return user
    }


    async findByEmail(email: string){
        const user = this.items.find(item => item.email == email)

        if (!user){
            return null
        }

        return user
    }
    
    async changeRoleToAdmin(user: User){
        const userIndex = this.items.indexOf(user)
        user.role = Role.ADMIN
        this.items[userIndex] = user
    }
    
    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: randomUUID(),
            username: data.username,
            email: data.email,
            password: data.password,
            role: Role.USER,
            created_at: new Date(),
            updated_at: new Date(),
        }
        
        this.items.push(user)
        
        return user
    }
    
    async searchMany(q: string, page: number): Promise<User[]> {
        return this.items.filter((item) => item.username
        .includes(q))
        .slice((page -1) * 20, page * 20)
    }
    
}
