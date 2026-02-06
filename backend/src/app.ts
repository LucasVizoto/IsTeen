import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import { gameRoutes } from "./http/controllers/games/routes.js";
import { userRoutes } from "./http/controllers/users/routes.js";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { integrationRoutes } from "./http/controllers/integrations/routes.js";

const isTesting = env.NODE_ENV === 'test' || env.NODE_ENV === 'e2e';

//*********INSTANCIA DA APLICAÇÃO COM CONFIGS DO SERVIDOR DE LOG*********//
export const app = fastify()

//*********REGISTRO DE ROTAS*********//
app.register(gameRoutes)
app.register(userRoutes)
app.register(integrationRoutes)
//*********REGISTRO DE PLUGINS*********//
app.register(fastifyCookie)
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false, 
    },
    sign:{
        expiresIn: '10m',
    }
})
app.register(fastifyMultipart, {
  attachFieldsToBody: true, 
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB 
  }
});

app.register(fastifyCors, {
    origin: true, 
    credentials: true, 
})

//*********HANDLER DE ERROS*********//
app.setErrorHandler((error, _request, reply)=>{
    if (error instanceof ZodError){
        return reply
        .status(400)
        .send({message: 'Validation error.', issues: error.format()})
    }
    if (env.NODE_ENV !== "production"){
        
        return reply.status(error.statusCode ?? 400).send({message: error.message})

    }
    return reply.status(500).send({message: 'Internal Server Error'})
})