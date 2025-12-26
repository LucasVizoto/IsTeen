import cloudinary from '@/lib/cloudnary.js'; // Importe sua config
import { Readable } from 'stream';

export async function uploadToStorage(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Cria uma stream de upload para o Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'games', // Organize em pastas se desejar
        public_id: filename.split('.')[0] || filename, // Opcional: define o nome do arquivo no Cloudinary
        resource_type: 'auto', // Detecta se é imagem, video, etc.
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        // Retorna a URL segura da imagem
        resolve(result?.secure_url || '');
      }
    );

    // Converte o Buffer em uma Stream legível e envia para o Cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Sinaliza o fim da stream
    
    // Pipe (conecta) a stream de leitura na stream de upload
    readableStream.pipe(uploadStream);
  });
}