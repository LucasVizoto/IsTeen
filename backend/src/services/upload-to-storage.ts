import { env } from "@/env/index.js";
import { supabase } from "@/lib/supabase.js";
import { randomUUID } from "node:crypto";
import { UploadToBucketFailedError } from "./_errors/upload-to-bucket-failed-error.js";

interface UploadToStorageRequest{
    fileName: string,
    file: Buffer
}

interface UploadToStorageResponse{
    publicUrl: string
}

export class UploadToStorageService {
  /**
   * Envia um anexo para o armazenamento do Supabase
   */
  async upload({fileName, file}: UploadToStorageRequest): Promise<UploadToStorageResponse> {
    try {
        const imageId = randomUUID()
        const filePath = `images/${imageId+fileName}`; 
          const { data, error } = await supabase
          .storage
          .from(env.SUPABASE_BUCKET_NAME)
          .upload(
            `${fileName}-${randomUUID()}`,
            file,
          )

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