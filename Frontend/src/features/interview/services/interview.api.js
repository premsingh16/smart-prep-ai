import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

/**
 * Generates an interview report by uploading resume PDF, job description, and self description
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    const response = await api.post('/api/interview/', formData);
    return response.data;
};

/**
 * Fetches a single interview report by its ID
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * Fetches all reports belonging to the authenticated user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview/');
    return response.data;
};