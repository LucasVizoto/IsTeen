import type { FastifyInstance } from "fastify";
import { sendEmail } from "./send-mail.js";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";

export async function integrationRoutes(app: FastifyInstance){
    app.addHook('onRequest', verifyJWT)
    
    app.post('/send-email', {onRequest: [verifyUserRole('ADMIN')]}, sendEmail)
}