import { makeFindGameByIdUseCase } from '@/use-cases/games/factories/make-find-game-by-id-use-case.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function getGameById (request: FastifyRequest, reply: FastifyReply) {

    const getGameParamsSchema = z.object({
        gameId: z.string().uuid(),
    })

    const {gameId} = getGameParamsSchema.parse(request.params)

    const getGameById = makeFindGameByIdUseCase()

    const {game} = await getGameById.execute({
        gameId,
    })


    return reply.status(200).send({
        game
    })
}