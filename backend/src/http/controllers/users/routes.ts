import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { authenticate } from "./authenticate.js";
import { profile } from "./profile.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { refresh } from "./refresh.js";
import { searchUsers } from "./search-many.js";
import { becomeUserAnAdmin } from "./make-admin.js";

export async function userRoutes(app: FastifyInstance){
    /* Users */
    app.post('/users', register)
    
    /* Token */
    app.post('/auth', authenticate)
    app.patch('/token/refresh', refresh)
    
    /* Autenticated */
    app.get('/me',{onRequest: [verifyJWT]}, profile)
    app.get('/users/search', {onRequest: [verifyJWT]}, searchUsers)
    app.patch('/users/:userId/promote-admin', {onRequest: [verifyJWT]}, becomeUserAnAdmin)
}