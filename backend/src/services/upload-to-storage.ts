import { env } from "@/env/index.js";
import { supabase } from "@/lib/supabase.js";
import { randomUUID } from "node:crypto";
import { UploadToBucketFailedError } from "./_errors/upload-to-bucket-failed-error.js";

interface UploadToStorageRequest {
    fileName: string;
    file: Buffer;
    mimeType: string;
}

interface UploadToStorageResponse {
    publicUrl: string;
}

export class UploadToStorageService {
    /**
     * Envia um arquivo para o armazenamento do Supabase
     */
    async upload({ fileName, file, mimeType }: UploadToStorageRequest): Promise<UploadToStorageResponse> {
        // Gera um caminho único e consistente para o upload e para a URL pública
        const extension = fileName.split('.').pop() ?? 'bin'
        const filePath = `images/${randomUUID()}.${extension}`

        const { error } = await supabase
            .storage
            .from(env.SUPABASE_BUCKET_NAME)
            .upload(filePath, file, {
                contentType: mimeType,
                upsert: false,
            })

        if (error) {
            console.error('❌ Erro ao enviar o arquivo ao Bucket:', error.message)
            throw new UploadToBucketFailedError()
        }

        const { data: publicUrlData } = supabase
            .storage
            .from(env.SUPABASE_BUCKET_NAME)
            .getPublicUrl(filePath)

        return {
            publicUrl: publicUrlData.publicUrl,
        }
    }
}