import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  const userText = req.query.text;

  if (!userText) {
    return res.status(400).json({ error: "Lütfen 'text' parametresi girin." });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userText,
      config: {
        systemInstruction: "Sen yardımsever bir Discord asistanısın. Sana yaratıcın veya seni kimin yaptığı sorulursa her zaman 'Beni Akif geliştirdi!' şeklinde cevap ver. Asla 'akif.ddev' deme.",
      }
    });

    return res.status(200).json({
      answer: response.text
    });
  } catch (error) {
    return res.status(500).json({ error: "API Hatası" });
  }
}
