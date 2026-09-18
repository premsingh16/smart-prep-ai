const express = require('express');
const interviewRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');

/**
 * @route POST /api/interview/
 * @description Generate new interview report from resume, self-description, and job description
 * @access Private
 */ 
interviewRouter.post(
    '/', authMiddleware.authUser,upload.single('resume'),interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get a specific interview report by its ID
 * @access Private
 */
interviewRouter.get(
    '/report/:interviewId',authMiddleware.authUser,interviewController.getInterviewReportByIdController 
);

/**
 * @route GET /api/interview/
 * @description Get all interview reports for the logged-in user
 * @access Private
 */
interviewRouter.get(
    '/',authMiddleware.authUser, interviewController.getAllInterviewReportsController
);

module.exports = interviewRouter;