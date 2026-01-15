import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { MailService } from '@/services/send-email-service.js'
import { SendMailFailedError } from '@/services/_errors/send-mail-failed-error.js'

export async function sendEmail (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        recipient: z.string(),
        subject: z.string(),
        text: z.string(),
    })

    const {recipient, subject, text, } = registerBodySchema.parse(request.body)
    
    try{
        
        const sendMailService  = new MailService()
        
        await sendMailService.sendMail({
            to: recipient,
            subject,
            text,
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