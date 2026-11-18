import nodemailer from 'nodemailer';

const asunto = 'Acceso a Novedades Autónoma';

export type EstadoCorreoAcceso = 'aceptado' | 'no_configurado' | 'no_confirmado';

export async function enviarCorreoAcceso(
  idUsuario: number,
  destinatario: string,
  nombre: string,
  claveTemporal: string,
): Promise<EstadoCorreoAcceso> {
  const proveedor = process.env.CORREO_ACCESO_PROVEEDOR?.trim() || 'resend';

  const enlace = process.env.CORREO_ACCESO_URL_PORTAL?.trim();
  const texto = [
    'Hola, ' + nombre + ':',
    '',
    'Tu cuenta de secretaría en Novedades Autónoma está lista.',
    'Usuario: ' + destinatario,
    'Contraseña temporal: ' + claveTemporal,
    '',
    'Al ingresar, el portal te pedirá que crees una contraseña nueva.',
    enlace ? 'Ingresa al portal institucional: ' + enlace : 'Ingresa desde el portal institucional.',
    'Si no esperabas este mensaje, contacta a la administración del portal.',
  ].join('\n');

  if (proveedor === 'gmail') return enviarConGmail(destinatario, texto);
  if (proveedor !== 'resend') return 'no_configurado';

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const remitente = process.env.CORREO_ACCESO_REMITENTE?.trim();
  if (!apiKey || !remitente) return 'no_configurado';

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'acceso-secretaria-' + idUsuario,
      },
      body: JSON.stringify({
        from: remitente,
        to: [destinatario],
        subject: asunto,
        text: texto,
      }),
      signal: AbortSignal.timeout(5000),
    });
    await respuesta.body?.cancel();
    if (respuesta.ok) return 'aceptado';
    console.warn('El proveedor de correo rechazó la solicitud de acceso (HTTP ' + respuesta.status + ').');
  } catch {
    console.warn('No fue posible confirmar el envío del correo de acceso.');
  }
  return 'no_confirmado';
}

async function enviarConGmail(destinatario: string, texto: string): Promise<EstadoCorreoAcceso> {
  const user = process.env.GMAIL_SMTP_USER?.trim();
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD?.replace(/\s/g, '');
  if (!user || !pass) return 'no_configurado';

  try {
    const smtp = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 3000,
      greetingTimeout: 2500,
      socketTimeout: 5000,
    });
    const resultado = await smtp.sendMail({
      from: { name: 'Novedades Autónoma', address: user },
      to: [{ name: '', address: destinatario }],
      subject: asunto,
      text: texto,
    });
    if (resultado.accepted.length === 1 && !resultado.rejected.length) return 'aceptado';
  } catch {
    console.warn('Gmail SMTP no confirmó el envío del correo de acceso.');
  }
  return 'no_confirmado';
}
