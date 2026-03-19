import type { FastifyRequest, FastifyReply } from 'fastify'
import { UploadToStorageService } from '@/services/upload-to-storage.js'
import type { MultipartFile } from '@fastify/multipart'

export async function uploadToStorage(req: FastifyRequest, reply: FastifyReply) {
    // Com attachFieldsToBody: true, req.body é um objeto onde cada campo
    // multipart é exposto como um MultipartFile (para arquivos) ou string (para campos de texto).
    const body = req.body as Record<string, MultipartFile | string>

    const data = body.file as MultipartFile | undefined

    if (!data || !data.filename) {
        return reply.status(400).send({ message: 'File is required' })
    }

    // Consome o buffer da stream do arquivo antes de enviá-lo ao Supabase
    const fileBuffer = await data.toBuffer()
    const fileName = data.filename
    const mimeType = data.mimetype

    try {
        const uploadService = new UploadToStorageService()
        const { publicUrl } = await uploadService.upload({
            fileName,
            file: fileBuffer,
            mimeType,
        })

        return reply.status(200).send({
            success: true,
            url: publicUrl,
        })
    } catch (err) {
        throw err
    }
}