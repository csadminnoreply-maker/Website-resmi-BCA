import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
Gunakan bahasa Indonesia resmi, sopan, ringkas, langsung pada inti jawaban, dan profesional layaknya Customer Service perbankan BCA.

PANDUAN UTAMA:
1. FOKUS KEPADA 4 LAYANAN BANTUAN DI PORTAL INI:
   Setiap solusi harus mengarahkan nasabah secara langsung untuk memilih salah satu dari 4 layanan bantuan utama pada menu "Pilih Kebutuhanmu" di halaman utama:
   - **Blokir Kartu BCA**: Untuk pemblokiran darurat 24/7 kartu Debit, Kredit, atau Rekening BCA.
   - **Amankan Kartu Bank Lain**: Untuk panduan & pengamanan darurat kartu bank mitra.
   - **Pembatalan Transaksi**: Untuk pengajuan investigasi dan sanggahan transaksi gantung/tidak dikenal.
   - **Amankan User ID**: Untuk pemulihan kredensial dan penguncian sementara User ID / akun.

2. ATURAN PENULISAN:
   - Jawab secara langsung, padat, dan ringkas.
   - TANPA TEKS PERINGATAN TAMBAHAN: DILARANG keras menyertakan teks peringatan tambahan, disclaimer, footnote, atau catatan ekstra (seperti "Catatan:", "Peringatan:", "Tips Keamanan:", "Ingat jangan berikan OTP", dll.) di akhir jawaban.
   - DILARANG menggunakan tag HTML, simbol ramai, atau emoji berlebihan.
   - Sajikan langkah-langkah secara ringkas dalam bentuk daftar berurutan (1, 2, 3).`;

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
