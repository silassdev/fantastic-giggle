export async function sendTrackingSMS({
    phone,
    message,
}: {
    phone: string;
    message: string;
}) {
    await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: process.env.TERMII_API_KEY,
            to: phone,
            from: process.env.TERMII_SENDER_ID,
            sms: message,
            type: 'plain',
            channel: 'generic',
        }),
    });
}
