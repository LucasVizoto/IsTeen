import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import { search } from "./search-many.js";
import { getGameById } from "./get-by-id.js";
import { deleteGame } from "./delete.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";
import { create } from "./create.js";

export async function gameRoutes(app: FastifyInstance){
    // validação do token para acessar as rotas
    app.addHook('onRequest', verifyJWT)

    // Rotas para obter as informações dos jogos
    app.get('/games', search)
    app.get('/games/:gameId', getGameById)

    //********ROTAS EXCLUSIVAS PARA USUÁRIOS ADMINISTRATIVOS********//
    app.delete('/games/:gameId', {onRequest: [verifyUserRole('ADMIN')]}, deleteGame)
    app.post('/games', {onRequest: [verifyUserRole('ADMIN')]}, create)
}