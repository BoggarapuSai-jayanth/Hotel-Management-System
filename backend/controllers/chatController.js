import { GoogleGenerativeAI } from '@google/generative-ai';


// @desc    Handle chat messages with Gemini
// @route   POST /api/chat
// @access  Public
export const handleChat = async (req, res) => {
    try {
        console.log("Chat endpoint hit with message:", req.body.message);
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('placeholder')) {
            return res.json({ reply: "I'm a placeholder Gemini AI since a valid API key isn't provided. But yes, I would answer your hotel related queries here!" });
        }
        // console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an AI assistant for a premium hotel management web application. Answer the user's question briefly and politely. User question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.log('Chat error details:', error.message || error);
        try {
            import('fs').then(fs => fs.writeFileSync('chat_error.log', error.stack || String(error)));
        } catch (e) { }
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting right now." });
    }
};
