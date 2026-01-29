import type { ISendMailOptions } from "@/interfaces/mail-interface.js";
import { transporter } from "@/lib/mail.js";
import { SendMailFailedError } from "./_errors/send-mail-failed-error.js";
import { env } from "@/env/index.js";
import { supabase } from "@/lib/supabase.js";
import { randomUUID } from "node:crypto";
import { UploadToBucketFailedError } from "./_errors/upload-to-bucket-failed-error.js";

interface UploadToStorageRequest{
    fileName: string,
    buffer: Buffer
}

interface UploadToStorageResponse{
    publicUrl: string
}

export class UploadToStorageService {
  /**
   * Envia um anexo para o armazenamento do Supabase
   */
  async upload({fileName, buffer}: UploadToStorageRequest): Promise<UploadToStorageResponse> {
    try {
        const imageId = randomUUID()
        const filePath = `images/${imageId+fileName}`; 
        await supabase.storage
        .from(env.SUPABASE_BUCKET_NAME)
        .upload(filePath, buffer);

        const publicUrlReturnData = supabase
        .storage
        .from(env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);

        const publicUrl = publicUrlReturnData.data.publicUrl;

        return {
            publicUrl
        }

    } catch (error) {
      console.error('❌ Erro ao enviar o anexo ao Bucket:', error);
      throw new UploadToBucketFailedError();
    }
  }
}