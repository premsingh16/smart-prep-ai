# Smart Prep AI

An AI-powered interview preparation platform that analyzes a candidate's resume against a target job description and generates a personalized interview preparation plan.

Users can upload their resume, provide a job description and a short self-description, and receive an AI-generated report containing a match score, technical questions, behavioral questions, skill gaps, and a day-by-day preparation roadmap.

---

## Features

* Resume-based interview preparation
* PDF resume upload
* Job description analysis
* Candidate self-description input
* AI-generated job match score
* Technical interview questions
* Behavioral interview questions
* Question intent and model answers
* Skill gap analysis with severity levels
* Personalized preparation roadmap
* Saved interview reports
* Report history dashboard
* User-specific report access
* JWT authentication using HTTP-only cookies
* Token blacklisting on logout
* MongoDB-based persistence
* Protected application routes
* Loading and error states for AI generation

---

## Live Demo

[Open the Live Application](https://smart-prep-ai-seven.vercel.app/)

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Sass
* Lucide React

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* pdf-parse
* CORS
* Cookie Parser

### AI

* Google GenAI SDK
* Gemini

---

## Architecture

```text
                         ┌─────────────────────────┐
                         │      React Frontend     │
                         │                         │
                         │  Login / Register       │
                         │  Resume Upload          │
                         │  Job Description        │
                         │  Self Description       │
                         │  Report Dashboard       │
                         └────────────┬────────────┘
                                      │
                              HTTP / REST API
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      Express Backend    │
                         │                         │
                         │  Authentication         │
                         │  Resume Processing      │
                         │  Interview Reports      │
                         └──────┬──────────┬───────┘
                                │          │
                                │          │
                        ┌───────▼───┐   ┌──▼──────────────┐
                        │  MongoDB  │   │  Resume Parser  │
                        │           │   │                 │
                        │ Users     │   │ pdf-parse       │
                        │ Reports   │   │                 │
                        └───────────┘   └───────┬─────────┘
                                                │
                                                ▼
                                     ┌─────────────────────┐
                                     │     Gemini AI       │
                                     │                     │
                                     │ Match Score         │
                                     │ Technical Questions│
                                     │ Behavioral Questions│
                                     │ Skill Gaps          │
                                     │ Preparation Plan    │
                                     └─────────────────────┘
```

---

## How It Works

### 1. User Authentication

Users can create an account or log in using their email and password.

After authentication, the backend issues a JWT and stores it in an HTTP-only cookie.

```text
Register / Login
      │
      ▼
JWT Generated
      │
      ▼
HTTP-only Cookie
      │
      ▼
Protected API Requests
      │
      ▼
JWT Verification
```

The backend checks the cookie on protected requests before allowing access to interview reports or report generation.

---

### 2. Resume and Job Inputs

To generate a personalized report, the user provides three inputs:

* Resume in PDF format
* Target job description
* Self-description

All three are required before report generation.

```text
PDF Resume
    +
Job Description
    +
Self Description
        │
        ▼
   Generate Report
```

---

## Resume Processing

The backend receives the uploaded PDF using Multer and stores it in memory for processing.

The PDF content is then extracted using `pdf-parse`.

```text
PDF Upload
    │
    ▼
Multer
    │
    ▼
pdf-parse
    │
    ▼
Extracted Resume Text
```

The uploaded file size is limited to **3 MB**.

---

## AI Report Generation

After extracting the resume text, the backend sends three pieces of information to Gemini:

* Resume text
* Job description
* Self-description

The AI service is configured to return structured JSON rather than free-form text.

The generated report contains:

```text
Job Title
Match Score
Technical Questions
Behavioral Questions
Skill Gaps
Preparation Plan
```

---

## Match Score

The match score is generated on a **0–100 scale**.

The prompt explicitly instructs Gemini to calculate the score by comparing:

* Required skills
* Relevant experience
* Projects
* Education
* Qualifications

The **self-description is not used to calculate the match score**. It is used to help generate relevant interview questions and the preparation plan.

This keeps the score focused on the candidate's resume against the target job description.

---

## Structured AI Output

The Gemini response is validated against a predefined schema.

### Technical Questions

Each technical question contains:

* Question
* Intention
* Model answer

### Behavioral Questions

Each behavioral question contains:

* Question
* Intention
* Model answer

### Skill Gaps

Each identified gap contains:

* Skill
* Severity

Severity levels:

```text
low
medium
high
```

### Preparation Plan

The preparation plan contains:

* Day
* Focus area
* Tasks

This structured response makes it easier for the frontend to render and organize the generated report.

---

## Interview Report

Generated reports are stored in MongoDB.

A report contains:

```text
title
jobDescription
resume
selfDescription
matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan
user
createdAt
updatedAt
```

Users can open previous reports from the report history section.

Reports are associated with the authenticated user, and the backend checks the user ID when retrieving a report.

---

## Report Dashboard

The home page displays previously generated reports.

Each report shows summary information such as:

* Job title
* Match score
* Creation date

Selecting a report opens the complete interview preparation dashboard.

The detailed report is divided into:

```text
Technical Questions
Behavioral Questions
Preparation Roadmap
```

The report also shows:

* Match score
* Match status
* Skill gaps

---

## Authentication & Security

The backend uses JWT-based authentication with HTTP-only cookies.

### Password Security

Passwords are hashed using **bcryptjs** before being stored in MongoDB.

### HTTP-only Cookies

The JWT is stored in a cookie configured with:

* `httpOnly`
* `secure` in production
* `sameSite` configured according to the environment

This prevents frontend JavaScript from directly accessing the authentication cookie.

### Token Blacklisting

When a user logs out, the current JWT is added to a MongoDB blacklist before the authentication cookie is cleared.

Subsequent requests using that token are rejected.

```text
Logout
  │
  ▼
Read JWT
  │
  ▼
Store Token in Blacklist
  │
  ▼
Clear Cookie
  │
  ▼
Token Can No Longer Authenticate
```

---

## Protected Routes

The frontend protects the main application routes using an authentication guard.

Protected sections include:

```text
/
└── Interview Planning

/interview/:interviewId
└── Detailed Interview Report
```

Unauthenticated users are redirected to the login page.

The backend also independently validates authentication for protected API routes.

---

## API Endpoints

### Authentication

| Method | Endpoint             | Purpose                     |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Create a new account        |
| POST   | `/api/auth/login`    | Log in                      |
| GET    | `/api/auth/logout`   | Log out and blacklist token |
| GET    | `/api/auth/get-me`   | Get current user            |

### Interview Reports

| Method | Endpoint                             | Purpose                         |
| ------ | ------------------------------------ | ------------------------------- |
| POST   | `/api/interview/`                    | Generate a new interview report |
| GET    | `/api/interview/`                    | Get the user's report history   |
| GET    | `/api/interview/report/:interviewId` | Get a specific report           |

The interview endpoints require authentication.

---

## Project Structure

```text
smart-prep-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   └── services/
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── interview.context.jsx
│   │   │
│   │   ├── app.routes.jsx
│   │   └── main entry files
│   │
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── database.js
    │   │
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   └── interview.controller.js
    │   │
    │   ├── middlewares/
    │   │   ├── auth.middleware.js
    │   │   └── file.middleware.js
    │   │
    │   ├── models/
    │   │   ├── user.model.js
    │   │   ├── blacklist.model.js
    │   │   └── interviewReport.model.js
    │   │
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   └── interview.routes.js
    │   │
    │   ├── services/
    │   │   └── ai.service.js
    │   │
    │   └── app.js
    │
    ├── server.js
    └── package.json
```

---

## Local Setup

### Prerequisites

* Node.js
* npm
* MongoDB
* Google Gemini API key
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/premsingh16/smart-prep-ai.git
cd smart-prep-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

For production:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL in the terminal.

---

## Environment Variables

### Backend

| Variable               | Purpose                             |
| ---------------------- | ----------------------------------- |
| `PORT`                 | Backend server port                 |
| `MONGO_URI`            | MongoDB connection string           |
| `JWT_SECRET`           | Secret used to sign and verify JWTs |
| `GOOGLE_GENAI_API_KEY` | Google GenAI API key                |
| `FRONTEND_URL`         | Allowed frontend origin             |
| `NODE_ENV`             | Application environment             |

### Frontend

| Variable       | Purpose              |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

> Keep your actual `.env` files and secret values out of GitHub.

---

## Engineering Decisions

### Structured AI Output

Instead of relying on free-form AI text, the Gemini service defines a structured response schema for the report.

This gives the backend predictable fields for the frontend to consume and display.

### Resume Parsing Before AI Processing

The backend extracts text from the uploaded PDF before sending it to Gemini.

This avoids sending the PDF binary directly to the AI service and gives the application a text representation that can be combined with the job description and self-description.

### Separation of Match Score and Preparation Context

The AI prompt separates two different goals:

* Resume + job description → match score
* Resume + job description + self-description → interview questions and preparation plan

This prevents the user's self-description from directly influencing the calculated job-match score.

### User-Specific Report Access

Reports are stored with the associated user ID.

When a report is requested, the backend queries using both the report ID and authenticated user ID.

This ensures users can access only their own reports.

### Token Blacklisting

JWT authentication is combined with a blacklist stored in MongoDB.

This provides a way to invalidate a token after logout rather than relying only on the token's expiration time.

---

## Error Handling

The AI generation flow handles service-specific failures.

For example:

* `503` → AI service temporarily unavailable
* `429` → AI usage limit reached
* `500` → Internal server error

The frontend also provides loading states while reports are being generated or loaded.

---

## Future Improvements

* Add stronger input validation for job descriptions and self-descriptions
* Add support for additional resume formats if needed
* Improve report versioning and editing
* Add analytics for preparation progress
* Add interview simulation with interactive follow-up questions
* Add more granular AI controls for difficulty and question types
* Add background processing for longer AI generation workflows

---

## Author

**Prem Singh**

* [GitHub](https://github.com/premsingh16)
* [LinkedIn](https://www.linkedin.com/in/premsingh16/)

---

## License

This project is currently provided without a specified open-source license.
