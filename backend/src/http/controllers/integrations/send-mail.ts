import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { MailService } from '@/services/send-email-service.js'
import { SendMailFailedError } from '@/services/_errors/send-mail-failed-error.js'
import path from 'node:path'
import fs from 'node:fs/promises';


export async function sendEmailToAdminPromotion (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        to: z.string(),
    })

    const {to} = registerBodySchema.parse(request.body)
    
    try{
        
        const sendMailService  = new MailService()
        
        const templatePath = path.resolve(process.cwd(), 'src', 'static', 'isteen-admin-promotion.html');
    
        const htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        await sendMailService.sendMail({
            to,
            subject: "🚀 Promoção: Bem-vindo à Administração ISTEEN",
            text: "Parabéns! Você foi promovido a Administrador da comunidade ISTEEN.",
            html: htmlTemplate
        })
    } catch (err){
        if(err instanceof SendMailFailedError){
            return reply.status(502).send({
                success: false,
                message: err.message
            })
        }
        throw err
    }

    return reply.status(200).send({
        success: true,
        message: "The E-mail has been sended successfuly!"
    })
}