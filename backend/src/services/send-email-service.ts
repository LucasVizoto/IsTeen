import { transporter } from "@/lib/mail.js";
import { SendMailFailedError } from "./_errors/send-mail-failed-error.js";
import { env } from "@/env/index.js";

export interface ISendMailOptions {
  to: string | string[]; 
  subject: string;
  text?: string;    
  html?: string;
}

export class MailService {
  /**
   * Envia um e-mail utilizando o transporter configurado na lib
   */
  async sendMail({ to, subject, text, html }: ISendMailOptions): Promise<void> {
    try {
      const info = await transporter.sendMail({
        from: env.MAIL_FROM, // Remetente padrão
        to,
        subject,
        text, 
        html
      });

      console.log(`✉️ E-mail enviado com sucesso! ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      throw new SendMailFailedError();
    }
  }
}