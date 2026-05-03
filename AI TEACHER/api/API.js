export default async function handler(req, res) {
    // Lấy Key từ cấu hình của Vercel (đã giấu đi)
    const API_KEY = process.env.GEMINI_API_KEY;

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;

    try {
        // Sử dụng biến ${API_KEY} thay vì dán trực tiếp mã vào đây
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are an expert English teacher. Your name is Luna. 
                1. If the user makes grammar mistakes, gently correct them first in a small section.
                2. Reply to their message naturally in English.
                3. Keep the conversation encouraging.
                Current message: ${message}` }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates) {
            return res.status(500).json({ error: "Lỗi phản hồi từ AI" });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });
    } catch (error) {
        res.status(500).json({ error: "Teacher is resting, try again later!" });
    }
}