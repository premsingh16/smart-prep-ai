import { getAllInterviewReports, getInterviewReportById, generateInterviewReport } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";


export const useInterview = () => {
    const context = useContext(InterviewContext);
    const {interviewId}  = useParams() 
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }
    
    const { loading, setLoading, report, setReport, reports, setReports } = context;
    
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating report:", error);
            if (error.response?.status === 503) {
                alert("The AI service is currently experiencing high global demand. Please try again in a minute.");
                window.location.reload(); 
            }
            return null;
        } finally {
            setLoading(false);
        }
        return response?.interviewReport || null; 
    };

    const getReportById = async (interviewId) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error fetching report by ID:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport || null;
    };

    const getReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.error("Error fetching all reports:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReports || null;
    };
    useEffect(()=> {
        if( interviewId ){
            getReportById(interviewId)
        }
        else {
            getReports()
        }
    },[interviewId])

    return { loading, report, reports, generateReport, getReports, getReportById };
};