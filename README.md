# AI-Powered Resume Analyzer

An AI-powered web application that analyzes your resume against a target job title and description. It gives you a **Resume Score**, an **ATS Score**, a resume summary, key strengths, and actionable improvement suggestions — all in **7 languages**.

---

## Features

- Upload resume as PDF, PNG, or JPG
- Custom binary PDF parser — no external PDF library needed
- AI-powered analysis using Llama 3.3 70B via Groq
- Resume Score — how well your resume matches the job
- ATS Score — how well your resume is structured for ATS systems
- Resume summary, 3 key strengths, and 4 improvement suggestions
- Supports 7 languages: English, Hindi, Spanish, French, German, Japanese, Arabic
- Scores stay consistent across all languages
- Google sign-in via Firebase Authentication
- Secure backend — API key never exposed to the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (JSX) |
| Backend | Node.js + Express.js |
| AI Model | Llama 3.3 70B via Groq API |
| Authentication | Firebase Authentication |
| File Processing | Custom Binary PDF Parser + Base64 Image Encoding |
| API Architecture | REST API |

---

## Project Structure

```
resume-analyzer/
├── public/
├── src/
│   ├── resume-analyzer.jsx   # Main React component
│   ├── firebase.js           # Firebase config and auth functions
│   ├── App.js
│   └── index.js
├── server.js                 # Express backend server
├── evaluate_final.py         # Evaluation metrics script (Python)
├── package.json
├── .env                      # Your API keys (never commit this)
└── README.md
```

---

## Prerequisites

Make sure you have these installed on your machine before starting:

- [Node.js](https://nodejs.org/) version 16 or higher
- npm (comes with Node.js)
- A [Groq API key](https://console.groq.com/) — free to create
- A [Firebase project](https://console.firebase.google.com/) — free to create

---

## Installation and Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### Step 2 — Install dependencies

```bash
npm install
npm install dotenv concurrently
```

### Step 3 — Set up your environment variables

Create a file called `.env` in the root of the project and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

To get your Groq API key:
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up or log in
3. Go to API Keys and create a new key
4. Copy and paste it into the `.env` file

### Step 4 — Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com/)
2. Create a new project
3. Go to Authentication and enable **Google** as a sign-in method
4. Go to Project Settings and copy your Firebase config object
5. Open `src/firebase.js` and replace the config values with your own:

```js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

---

## Running the Project

You need **two things running at the same time** — the React frontend and the Express backend.

### Option A — Run both with one command (recommended)

```bash
npm run dev
```

This starts both servers together. You will see:

```
✅ Backend server running on http://localhost:3001
✅ React app running on http://localhost:3000
```

### Option B — Run them separately in two terminals

**Terminal 1 — Start the backend:**
```bash
node server.js
```

**Terminal 2 — Start the frontend:**
```bash
npm start
```

Then open your browser and go to:
```
http://localhost:3000
```

---

## How to Use

1. Open the app at `http://localhost:3000`
2. Sign in with your Google account
3. Upload your resume as a PDF, PNG, or JPG (max 10MB)
4. Enter the target job title (e.g. Frontend Developer)
5. Optionally enter a job description for more accurate results
6. Click **Analyze Resume**
7. View your Resume Score, ATS Score, summary, strengths, and improvements
8. Switch language using the dropdown at the top right

---

## Verify the Backend is Running

Open this URL in your browser after starting the server:

```
http://localhost:3001/api/health
```

You should see:

```json
{ "status": "ok", "model": "llama-3.3-70b-versatile" }
```

If you see this, the backend is running correctly.

---

## Running the Evaluation Metrics (Optional)

The project includes a Python script that generates evaluation charts including the ROC Curve, Confusion Matrix, Precision-Recall Curve, Score Distribution, and Radar Chart.

### Step 1 — Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2 — Install Python dependencies

```bash
pip install matplotlib scikit-learn numpy
```

### Step 3 — Run the script

```bash
python3 evaluate_final.py
```

Five chart images will be saved in your project folder:

- `fig1_metrics_bar.png`
- `fig2_roc_curve.png`
- `fig3_pr_curve.png`
- `fig4_confusion_matrix.png`
- `fig5_score_distribution.png`

---

## Common Errors and Fixes

**"Analysis failed. Failed to fetch"**
The backend server is not running. Run `node server.js` or `npm run dev`.

**"Analysis failed. Request timed out"**
Groq took too long to respond. Try again — this usually resolves itself.

**"No module named numpy"**
You are not inside the virtual environment. Run `source venv/bin/activate` first.

**Scores showing 50 and 45 every time**
Your Groq API key may be invalid or the model is not responding. Check your `.env` file and verify the key at [console.groq.com](https://console.groq.com/).

---

## Important Notes

- The `.env` file contains your secret API key. **Never commit it to GitHub.** Make sure `.gitignore` includes `.env` and `node_modules/`.
- Your resume is processed locally in the browser. It is never stored anywhere.
- The Groq API is free to use with generous rate limits for development.
- Make sure both the frontend (port 3000) and backend (port 3001) are running before analyzing a resume.
