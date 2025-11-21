import type { Game, Prisma } from "generated/prisma/index.js";

export interface GamesRepository{
    create(data: Prisma.GameCreateInput): Promise<Game>
    delete(id: string): Promise<void>
    searchMany(q: string, page:number):Promise<Game[]>
    findById(id: string): Promise<Game | null>
}