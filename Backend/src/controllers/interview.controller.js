const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @description Controller to generate report based on self description, resume PDF, and job description
 */
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF file is required."
            });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Job description is required."
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            jobDescription,
            selfDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            jobDescription,
            selfDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport 
        });

    } catch (error) {
        console.error("Generate Report Error:", error.message);

        // Catch specific Gemini API errors
        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "The AI service is experiencing high global demand. Please try again in a minute."
            });
        }
        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "AI usage limit reached. Please try again later."
            });
        }

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while generating the report.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get a single interview report by its ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });
        
        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: 'Interview report not found.'
            });
        }

        return res.status(200).json({
            message: 'Interview report fetched successfully.',
            interviewReport
        });

    } catch (error) {
        console.error("Fetch By ID Error:", error.message);

        // Handles invalid MongoDB ObjectId strings
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid interview report ID.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching interview report.',
            error: error.message
        });
    }
}

/**
 * @description Controller to get all interview reports for the logged-in user
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan');

        return res.status(200).json({
            message: 'Interview reports fetched successfully.',
            interviewReports
        });

    } catch (error) {
        console.error("Fetch All Reports Error:", error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching interview reports.',
            error: error.message
        });
    }
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController 
};