import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import  logtailStream from "./lib/logtail.js";
import { gameRoutes } from "./http/controllers/games/routes.js";
import { userRoutes } from "./http/controllers/users/routes.js";
import fastifyCookie from "@fastify/cookie";

const isTesting = env.NODE_ENV === 'test' || env.NODE_ENV === 'e2e';

//*********INSTANCIA DA APLICAÇÃO COM CONFIGS DO SERVIDOR DE LOG*********//
export const app = fastify({
    logger: isTesting
    ? false // <<< 1. DESATIVA o logger completamente para testes
    : env.NODE_ENV === 'production'
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
app.register(userRoutes)
app.register(fastifyCookie)

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