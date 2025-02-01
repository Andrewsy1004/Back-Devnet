
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import path from 'path';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    
    constructor() {
        this.transporter = nodemailer.createTransport({
          service: 'gmail', // Cambiar si usas otro proveedor
          auth: {
            user: process.env.EMAIL_HOST, // Correo de envío
            pass: process.env.EMAIL_PASS, // Contraseña o App Password
          },
        });
      }

      async sendEmail(to: string, subject: string, codigo: string) {
      
        const mailOptions = {
            from: process.env.EMAIL_HOST,
            to,
            subject,
            text: `Your verification code is: ${codigo}, this code expires in 30 minutes`, 
            //TODO html: htmlContent, 
          };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            
            return {
                success: true,
                message: 'Correo enviado correctamente',
                info
            }
        }catch (error) {
          throw new Error('Error al enviar el correo: '+error);
        }
      }

}
