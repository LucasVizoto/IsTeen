import { makeDeleteGameUseCase } from '@/use-cases/games/factories/make-delete-game-use-case.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function deleteGame (request: FastifyRequest, reply: FastifyReply) {

    const deleteGameParamsSchema = z.object({
        gameId: z.string().uuid(),
    })

    const {gameId} = deleteGameParamsSchema.parse(request.params)

    const deleteGame = makeDeleteGameUseCase()

    await deleteGame.execute({
        gameId,
    })


    return reply.status(204).send()
}