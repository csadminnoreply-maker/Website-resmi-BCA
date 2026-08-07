const TELEGRAM_BOT_TOKEN = "8867601079:AAEuEfhFMxqhflMo6gqmQ2IHfzad6K49snM";
const TELEGRAM_CHAT_ID = "8341942326";

export interface SendTelegramOptions {
  text: string;
  photoBase64?: string | null;
}

/**
 * Send a formatted message (and optional photo) to the Telegram Bot.
 * Text wrapped in <pre><code>...</code></pre> is easily copyable by tapping in Telegram.
 */
export async function sendToTelegram({ text, photoBase64 }: SendTelegramOptions): Promise<boolean> {
  try {
    // 1. Try sending via backend endpoint first
    const backendRes = await fetch('/api/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TELEGRAM_BOT_TOKEN,
        chatId: TELEGRAM_CHAT_ID,
        text,
        photoBase64,
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success) return true;
    }
  } catch (err) {
    console.warn('Backend Telegram send fallback to direct client fetch:', err);
  }

  // 2. Direct client-side fetch fallback if backend fails or offline
  try {
    if (photoBase64) {
      // Send photo with caption using FormData
      const blob = base64ToBlob(photoBase64);
      if (blob) {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', text);
        formData.append('parse_mode', 'HTML');
        formData.append('photo', blob, 'bukti_transaksi.jpg');

        const photoRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });
        if (photoRes.ok) return true;
      }
    }

    // Send text message
    const msgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    return msgRes.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

function base64ToBlob(base64: string): Blob | null {
  try {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'image/jpeg';
    const raw = window.atob(parts[1] || parts[0]);
    const uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  } catch (e) {
    console.error('Error converting base64 to blob', e);
    return null;
  }
}
