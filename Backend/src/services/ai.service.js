const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

// Initialize the Gemini client using the API key from environment variables.
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// Define the expected structure of the AI-generated interview report.
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


// Generates a structured interview report using the candidate and job information.
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    // Combine the candidate information and job description into the AI prompt.
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            // Request JSON output so the response can be parsed programmatically.
            responseMimeType: "application/json",

            // Convert the Zod schema to JSON Schema to define the expected AI output.
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    // Convert the JSON string returned by Gemini into a JavaScript object.
    return JSON.parse(response.text)


}


// Converts HTML content into a PDF buffer using Puppeteer.
async function generatePdfFromHtml(htmlContent) {

    // Launch a headless browser that can render the generated HTML.
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    // Load the HTML and wait until network activity has finished.
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Render the loaded HTML page as an A4 PDF with custom margins.
    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    // Close the browser after generating the PDF to release resources.
    await browser.close()

    return pdfBuffer
}


// Generates an ATS-friendly resume PDF tailored to the provided job description.
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    // Define the expected AI response containing the generated resume HTML.
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    // Provide Gemini with the candidate information and instructions for generating the resume.
    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            // Request the resume as JSON instead of plain text.
            responseMimeType: "application/json",

            // Ensure Gemini returns the expected { html: string } structure.
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    // Parse the JSON response to access the generated HTML.
    const jsonContent = JSON.parse(response.text)

    // Convert the AI-generated HTML into a PDF buffer.
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }