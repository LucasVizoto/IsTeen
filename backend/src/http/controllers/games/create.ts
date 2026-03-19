import { makeCreateGameUseCase } from "@/use-cases/games/factories/make-create-game-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {

    // Com attachFieldsToBody: true, campos de texto chegam como { value: string, ... }
    // Precisamos extrair o .value de cada campo antes de validar com Zod
    const rawBody = request.body as Record<string, { value: string } | string>;

    const extractValue = (field: { value: string } | string | undefined): string =>
        field === undefined ? '' : typeof field === 'object' ? field.value : field;

    const createGameBodySchema = z.object({
        game_name: z.string().min(1),
        game_description: z.string().min(1),
        release_date: z.coerce.date(),
        url_game: z.string().url(),
        // url_image_game é opcional: pode vir do upload (já feito antes) ou ser uma URL digitada.
        // Caso nenhum dos dois seja enviado, salva como string vazia.
        url_image_game: z.union([z.string().url(), z.literal('')]).default(''),
        developer: z.string().min(1),
    });

    const parsed = createGameBodySchema.safeParse({
        game_name:        extractValue(rawBody.game_name),
        game_description: extractValue(rawBody.game_description),
        release_date:     extractValue(rawBody.release_date),
        url_game:         extractValue(rawBody.url_game),
        url_image_game:   extractValue(rawBody.url_image_game),
        developer:        extractValue(rawBody.developer),
    });

    if (!parsed.success) {
        return reply.status(400).send({
            message: 'Validation error.',
            issues: parsed.error.format(),
        });
    }

    const { game_name, game_description, release_date, url_game, url_image_game, developer } = parsed.data;

    const createGameUseCase = makeCreateGameUseCase();

    const { game } = await createGameUseCase.execute({
        game_name,
        game_description,
        release_date,
        url_game,
        url_image_game,
        developer,
    });

    return reply.status(201).send({ game });
}