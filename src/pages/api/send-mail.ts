import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

interface FormData {
  nombre: string;
  email: string;
  mensaje: string;
  'h-captcha-response': string;
}

export const post: APIRoute = async ({ request }) => {
  const data = await request.json() as FormData;

  // Verificar hCaptcha
  const verifyUrl = 'https://hcaptcha.com/siteverify';
  const verifyData = new URLSearchParams({
    secret: 'ES_13f6411878504ac5a0a8c6131a0a0c36',
    response: data['h-captcha-response'],
  });

  const hcaptchaVerify = await fetch(verifyUrl, {
    method: 'POST',
    body: verifyData,
  });
  const hcaptchaResult = await hcaptchaVerify.json();

  if (!hcaptchaResult.success) {
    return new Response(JSON.stringify({ error: 'Verificación hCaptcha fallida' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Configurar el transporte de correo
  let transporter = nodemailer.createTransport({
    host: "tu_servidor_smtp",
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: "tu_usuario_smtp",
      pass: "tu_contraseña_smtp"
    }
  });

  // Enviar el correo
  try {
    await transporter.sendMail({
      from: '"Tu Sitio Web" <noreply@tusitioweb.com>',
      to: "tu@email.com",
      subject: "Nuevo mensaje de contacto",
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nMensaje: ${data.mensaje}`,
      html: `<p><strong>Nombre:</strong> ${data.nombre}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Mensaje:</strong> ${data.mensaje}</p>`
    });

    return new Response(JSON.stringify({ message: 'Correo enviado con éxito' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return new Response(JSON.stringify({ error: 'Error al enviar el correo' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}