import { makeCreateGameUseCase } from "@/use-cases/games/factories/make-create-game-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply){

    const createGameBodySchema = z.object({
        game_name: z.string(),
        game_description: z.string(),
        release_date: z.coerce.date(),
        url_game: z.string().url(),
        url_image_game: z.string().url(), 
        developer: z.string()
    });

    const { 
        game_name, 
        game_description, 
        release_date, 
        url_game, 
        url_image_game, 
        developer 
    } = createGameBodySchema.parse(request.body);

    const createGameUseCase = makeCreateGameUseCase()

    const {game} = await createGameUseCase.execute({
        game_name,
        game_description,
        release_date,
        url_game,
        url_image_game,
        developer
    })

    return reply.status(201).send({
        game,
    })
}