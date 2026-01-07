import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const BEST_MODELS = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-exp-1206',
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite-001'
];

export const generateAIResponse = async (prompt, modelOptions = {}) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        for (const modelName of BEST_MODELS) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    ...modelOptions
                });
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                if (text) return text;
            } catch (err) {
                console.warn(`Model ${modelName} failed: ${err.message}`);
                continue;
            }
        }
        throw new Error('All Gemini models failed');
    } catch (error) {
        console.error('AI Service Error:', error.message);
        throw error;
    }
};

export const generateJSONResponse = async (prompt) => {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no explanations.`;
    const response = await generateAIResponse(jsonPrompt);
    try {
        // Find the first { and last } to extract JSON if the model included extra text
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            return JSON.parse(response.substring(firstBrace, lastBrace + 1));
        }
        return JSON.parse(response);
    } catch (e) {
        console.error('Failed to parse JSON response:', response);
        throw new Error('AI returned invalid JSON');
    }
};
