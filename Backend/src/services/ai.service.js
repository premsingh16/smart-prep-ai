const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
 
const geminiInterviewSchema = {
    type: "OBJECT",
    properties: {
        title: { 
            type: "STRING", 
            description: "The official job title extracted from the provided job description" 
        },
        matchScore: { type: "INTEGER", description: "Match score between 0 to 100" },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: { type: "STRING", description: "Must be low, medium, or high" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER" },
                    focus: { type: "STRING" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

/**
 * @description Generates interview report using Gemini AI based on candidate data
 */
async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    const prompt = `
        Generate an interview report for the candidate.

        Calculate matchScore ONLY by comparing the candidate's resume with the job description.
        Do not generate a random score. Consider required skills, relevant experience,
        projects, education, and qualifications. Score from 0 to 100.

        Use the self-description for generating relevant interview questions and the
        preparation plan, but do not use it to calculate matchScore.

        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiInterviewSchema, 
        }
    });
    
    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;