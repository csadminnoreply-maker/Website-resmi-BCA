export interface SendTelegramOptions {
  text: string;
  photoBase64?: string | null;
}

/**
 * Send a formatted message (and optional photo) via backend API proxy.
 * Keeps Telegram Bot Token and Chat ID hidden safely on the server.
 */
export async function sendToTelegram({ text, photoBase64 }: SendTelegramOptions): Promise<boolean> {
  try {
    const backendRes = await fetch('/api/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        photoBase64,
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success) return true;
    }
    return false;
  } catch (err) {
    console.error('Error sending Telegram notification via backend:', err);
    return false;
  }
}
