import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendTrackingEmail({
    to,
    orderId,
    status,
    message,
    location,
}: {
    to: string;
    orderId: string;
    status: string;
    message: string;
    location?: string;
}) {
    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject: `Order ${orderId} update: ${status}`,
        html: `
      <h3>Order Update</h3>
      <p><strong>Status:</strong> ${status}</p>
      <p>${message}</p>
      ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
    `,
    });
}
