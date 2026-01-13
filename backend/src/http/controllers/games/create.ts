import { makeCreateGameUseCase } from "@/use-cases/games/factories/make-create-game-use-case.js";
import { uploadToStorage } from "@/utils/upload-to-storage.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply){

// Tipagem básica para o que o fastify-multipart retorna
    // O ideal seria importar a interface MultipartFile do fastify-multipart se disponível, mas any funciona aqui
    const body = request.body as Record<string, any>;

    // Verifica se veio um arquivo de imagem
    const imageFile = body.image_file;
    
    // Inicializa com a URL de texto se houver (caso o usuário mande link externo)
    let finalImageUrl = body.url_image_game?.value; 

    // LÓGICA DE UPLOAD
    // Verificamos se imageFile existe e se tem a função toBuffer (indica que é um arquivo e não texto)
    if (imageFile && typeof imageFile.toBuffer === 'function') {
        try {
            // Converte o arquivo recebido para Buffer
            const buffer = await imageFile.toBuffer();
            
            // Faz o upload e recebe a nova URL do Cloudinary
            // imageFile.filename contém o nome original (ex: "mario.jpg")
            finalImageUrl = await uploadToStorage(buffer, imageFile.filename);
            
        } catch (error) {
            console.error(error);
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