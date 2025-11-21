import type { Game, Prisma } from "generated/prisma/index.js";
import type { GamesRepository } from "../games-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryGameRepository implements GamesRepository{
    
    public items: Game[] = []
    
    async create(data: Prisma.GameCreateInput): Promise<Game>{
        const game = {
            id: data.id ?? randomUUID(),
            game_name: data.game_name,
            game_description: data.game_description,
            release_date: typeof data.release_date === 'string' ? new Date(data.release_date) : data.release_date,
            url_game: data.url_game,
            url_image_game: data.url_image_game,
            developer: data.developer,
            created_at: new Date(),
            updated_at: new Date(),
        }
        
        this.items.push(game)
        
        return game
    }
    
    delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id === id);
        if (index > -1) {
            this.items.splice(index, 1);
        }
        return Promise.resolve();
    }

    async searchMany(query: string, page: number) {
        return this.items.filter((item) => item.game_name
        .includes(query))
        .slice((page -1) * 20, page * 20)
    }
    

    async findById(id: string) {
        const game = this.items.find((item) => item.id == id)

        if (!game){
            return null
        }

        return game
    }
    
}