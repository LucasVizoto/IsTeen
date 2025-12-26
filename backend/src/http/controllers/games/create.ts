import { makeCreateGameUseCase } from "@/use-cases/factories/make-create-game-use-case.js";
import { uploadToStorage } from "@/utils/upload-to-storage.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply){

    const body = request.body as Record<string, any>;

    // Verifica se veio um arquivo de imagem
    const imageFile = body.image_file;
    let finalImageUrl = body.url_image_game?.value; // Pega a URL de texto se houver

    // Se houver arquivo anexado, fazemos o upload
    if (imageFile && imageFile.filename) {
        try {
            // Converte o arquivo recebido para Buffer
            const buffer = await imageFile.toBuffer();
            
            // Faz o upload e recebe a nova URL
            finalImageUrl = await uploadToStorage(buffer, imageFile.filename);
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao realizar upload da imagem." });
        }
    }

    const rawData = {
        game_name: body.game_name?.value,
        game_description: body.game_description?.value,
        release_date: body.release_date?.value,
        url_game: body.url_game?.value,
        url_image_game: finalImageUrl, 
        developer: body.developer?.value
    };
    // ZOD VALIDATION
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
    } = createGameBodySchema.parse(rawData);

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