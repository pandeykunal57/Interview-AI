const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


// Generates an AI interview report using the uploaded resume and job details.
async function generateInterViewReportController(req, res) {

    // Convert the uploaded PDF buffer into a format accepted by PDFParse.
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const { selfDescription, jobDescription } = req.body

    // Send extracted resume text and job details to the AI service.
    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    // Store both the original inputs and AI-generated report in the database.
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}


// Fetches a specific interview report belonging to the logged-in user.
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    // Match both report ID and user ID to prevent users accessing other reports.
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


// Fetches all reports for the logged-in user, excluding large/sensitive fields.
async function getAllInterviewReportsController(req, res) {

    // Sort newest first and exclude detailed fields not needed in the list view.
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


// Generates a resume PDF using data stored in an existing interview report.
async function generateResumePdfController(req, res) {

    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    // Generate the PDF using the resume and job-specific information.
    const pdfBuffer = await generateResumePdf({
        resume,
        jobDescription,
        selfDescription
    })

    // Set headers so the browser treats the response as a downloadable PDF.
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    // Send the generated PDF buffer directly as the HTTP response.
    res.send(pdfBuffer)
}


// Export controllers so they can be connected to the corresponding routes.
module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}