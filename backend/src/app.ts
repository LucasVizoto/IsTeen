import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import { logtailStream } from "./lib/logtail.js";
import { gameRoutes } from "./http/controllers/games/routes.js";

//*********INSTANCIA DA APLICAÇÃO COM CONFIGS DO SERVIDOR DE LOG*********//
export const app = fastify({
    logger: env.NODE_ENV === 'production' 
        ? {
            level: 'info',
            stream: logtailStream
          }
        : {
            level: 'info',
            transport: {
                target: 'pino-pretty',
                options: { colorize: true }
            }
        }
})

//*********REGISTRO DE ROTAS*********//
app.register(gameRoutes)

//*********HANDLER DE ERROS*********//
app.setErrorHandler((error, _request, reply)=>{
    if (error instanceof ZodError){
        return reply
        .status(400)
        .send({message: 'Validation error.', issues: error.format()})
    }
    if (env.NODE_ENV !== "production"){
        
        _request.log.error(error,'Erro em ambiente de Desenvolvimento')
        return reply.status(error.statusCode ?? 400).send({message: error.message})

    } else {
        _request.log.error(error, "Erro Interno Não Tratado");    
    }

    return reply.status(500).send({message: 'Internal Server Error'})
})