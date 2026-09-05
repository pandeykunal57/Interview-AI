# AI Job Preparation Platform

A full-stack AI-powered job preparation web application that helps users analyze their resumes against job descriptions, identify skill gaps, prepare for interviews, and generate ATS-optimized resumes.

The application is built using **React.js, Node.js, Express.js, MongoDB, JWT, Google Gemini AI, and Puppeteer**, combining secure backend APIs with AI-powered resume and interview preparation features.

## Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Cookie-based token handling
* Protected routes
* Authentication middleware
* Token blacklisting on logout

### 📄 Resume Processing

* Resume file upload using Multer
* Resume processing and information extraction
* AI-powered resume analysis
* Skill extraction from resumes

### 💼 Job Description Analysis

* Job description analysis using Gemini AI
* Required skill identification
* Resume and job description comparison
* Skill gap detection

### 🤖 AI-Powered Interview Preparation

* Generate interview questions using Gemini AI
* Generate questions based on the user's resume and job description
* Personalized interview preparation
* AI-generated interview reports

### 📊 Interview Reports

* Generate interview reports
* View individual interview reports
* View recent interview reports
* Retrieve previously generated reports

### 📝 ATS-Optimized Resume

* AI-powered resume generation
* ATS-focused resume optimization
* Generate resume content based on the user's information
* Convert generated resume into a PDF
* Dynamic PDF generation using Puppeteer

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* Multer
* Zod

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### AI

* Google Gemini AI

### PDF Generation

* Puppeteer

## Project Goal

The goal of this project is to build a real-world full-stack application that combines **backend development with Generative AI** to provide practical tools for resume analysis, job preparation, interview question generation, skill-gap detection, and ATS-optimized resume creation.
