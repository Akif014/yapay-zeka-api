import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // CORS ekleyelim
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const userText = req.query.text;

  if (!userText) {
    return res.status(400).json({ error: "Lütfen 'text' parametresi girin." });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userText,
      config: {
        systemInstruction: "Sen yardımsever bir Discord asistanısın. Sana yaratıcın veya seni kimin yaptığı sorulursa her zaman 'Beni akif.ddev geliştirdi!' şeklinde cevap ver.",
      }
    });

    // Doğru yanıt alma yöntemi
    let answerText = "";
    if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      answerText = response.candidates[0].content.parts[0].text;
    } else if (response.text) {
      // Eğer text bir fonksiyonsa çağır
      answerText = typeof response.text === 'function' ? await response.text() : response.text;
    } else {
      answerText = "Yanıt alınamadı.";
    }

    return res.status(200).json({
      answer: answerText
    });

  } catch (error) {
    console.error("API Hatası:", error);
    return res.status(500).json({ 
      error: "API Hatası", 
      details: error.message 
    });
  }
}
