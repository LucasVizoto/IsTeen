import { env } from '@/env/index.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadToStorage(fileBuffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Cria um stream de upload para o Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'games-covers', // Pasta onde ficarão as imagens no Cloudinary
        resource_type: 'image',
        public_id: fileName.split('.')[0], // Usa o nome do arquivo (sem extensão) como ID opcional
      },
      (error, result) => {
        if (error) {
          console.error('Erro no Cloudinary:', error);
          return reject(error);
        }
        // Retorna a URL segura (https)
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload concluído mas URL não retornada"));
        }
      }
    );

    // Escreve o buffer no stream e finaliza
    uploadStream.end(fileBuffer);
  });
}