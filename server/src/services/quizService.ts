import { GoogleGenAI } from '@google/genai';
import { INote } from '../models/Note';
import dotenv from 'dotenv';

dotenv.config();
const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
	throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({ apiKey: gemini_api_key });
const model = 'gemini-2.0-flash'

function cleanAIResponse(text: string): string {
    // Remove any markdown code block markers
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        return jsonMatch[1].trim();
    }
    return text.trim();
}

export interface GeneratedQuestion {
	question: string;
	options: string[];
	correctAnswer: number;
}

export const generateQuestions = async (note: INote): Promise<GeneratedQuestion[]> => {
	try {
		const prompt = `Given the following note titled "${note.title}", generate 5 multiple choice questions to test understanding of the content. Each question should have 4 options, with exactly one correct answer. The questions should be challenging but fair.

Note Content:
\`\`\`
${note.content}
\`\`\`

Format the response as valid JSON array where each object has:
- question: the question text
- options: array of 4 possible answers
- correctAnswer: index (0-3) of the correct answer

Example:
"
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correctAnswer": 2
  }
]
"

Make sure the questions really test understanding of the note content, and are written in the same language as the note. And your response must contains plain JSON string only, nothing else, not even Markdown thing like "\`\`\`json", etc. In other word, I must be able to copy your response to a JSON file without seeing any diagnostic error.`;

		const response = await ai.models.generateContent({
			model: model,
			contents: prompt
		});
		const text = await response.text;
		if (!text) {
            console.log('No response text from AI')
            throw new Error('No response text from AI');
		}
        console.log(text)
		const cleanText = cleanAIResponse(text);
		// Parse the JSON response - it should be an array of question objects
		const questions = JSON.parse(cleanText);
        console.log(questions)

		// Validate the response format
		if (!Array.isArray(questions)) {
			throw new Error('Invalid response format from AI');
		}

		questions.forEach((q, i) => {
			if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 ||
				typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
				throw new Error(`Invalid question format at index ${i}`);
			}
		});

		return questions;
	} catch (error) {
		console.error('Error generating questions:', error);
		throw error;
	}
};
