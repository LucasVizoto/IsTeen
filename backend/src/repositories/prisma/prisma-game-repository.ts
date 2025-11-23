import type { Prisma, Game } from "generated/prisma/index.js";
import type { GamesRepository } from "../games-repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaGameRepository implements GamesRepository{
    
    async create(data: Prisma.GameCreateInput) {
        const game = await prisma.game.create({
            data,
        })
        return game
    }
    
    async delete(game: Game){
        await prisma.game.delete({
            where: {
                id: game.id
            }
        })
    }

    async searchMany(q: string, page: number){
        const games = await prisma.game.findMany({
            where: {
                game_name: {
                    contains: q,
                },
            },
            take: 20,
            skip: (page -1) * 20,
        })

        return games
    }

    
    async findById(id: string){
        const game = await prisma.game.findUnique({
            where:{
                id,
            }
        })
        return game
    }

}