import type { FastifyInstance } from "fastify";
import { sendEmailToAdminPromotion } from "./send-mail.js";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";
import { uploadToStorage } from "./upload-to-storage.js";

export async function integrationRoutes(app: FastifyInstance){
    app.addHook('onRequest', verifyJWT)
    
    app.post('/send-email', {onRequest: [verifyUserRole('ADMIN')]}, sendEmailToAdminPromotion)
    app.post('/upload-to-storage', {onRequest: [verifyUserRole('ADMIN')]}, uploadToStorage)
}