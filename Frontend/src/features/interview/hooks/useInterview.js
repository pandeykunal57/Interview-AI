/* eslint-disable react-hooks/exhaustive-deps */
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    // Get the current route parameter to determine which report is being viewed.
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    // Ensure the hook is only used inside an InterviewProvider.
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    // Generate a new AI interview report and store it in the context.
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    // Fetch a specific interview report using its ID.
    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    // Fetch all interview reports belonging to the logged-in user.
    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    // Generate a resume PDF and trigger a browser download.
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })

            // Convert the binary PDF response into a temporary browser URL.
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))

            // Create a temporary link because browsers download files through an anchor element.
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)

            // Add, click, and remove the temporary link to start the download.
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        // Fetch one report when an interviewId exists; otherwise fetch all reports.
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    // Expose interview state and actions to components using this hook.
    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}