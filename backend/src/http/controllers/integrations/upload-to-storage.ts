import type { FastifyRequest, FastifyReply } from 'fastify'
import { UploadToStorageService } from '@/services/upload-to-storage.js';

export async function uploadToStorage (request: FastifyRequest, reply: FastifyReply) {
    
    const data = await request.file();   
    
    if(!data){
        throw new Error('File is required');
    }        

    const fileName = data.filename;
    const buffer = await data.toBuffer(); 

    try{

        const uploadService  = new UploadToStorageService()
        const {publicUrl} = await uploadService.upload({
            fileName, 
            buffer
        })

        return reply.status(200).send({
            success: true,
            url: publicUrl
        })

    } catch (err){
        throw err
    }

}