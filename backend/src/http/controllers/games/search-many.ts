import { makeSearchManyGamesUseCase } from '@/use-cases/games/factories/make-search-many-games-use-case.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'

export async function search (request: FastifyRequest, reply: FastifyReply) {
    const searchManyGamesQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    })

    const {q, page} = searchManyGamesQuerySchema.parse(request.query)
    
        
    const searchManyGameUseCase  = makeSearchManyGamesUseCase()
    
    const {games} = await searchManyGameUseCase.execute({
        q,
        page
    })

    return reply.status(200).send({
        games
    })
}