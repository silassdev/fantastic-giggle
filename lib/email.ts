import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

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
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject: `Order ${orderId} update: ${status}`,
        html: `
      <h3>Order Update</h3>
      <p><strong>Status:</strong> ${status}</p>
      <p>${message}</p>
      ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
    `,
    });
    return info;
}
