# 🧠 Resume Analyzer

An AI-powered resume analyzer that gives you a Resume Score, ATS Score, detailed strengths, and improvement suggestions — in 7 languages.

Built with **React**, **Node.js**, and **Groq AI (Llama 3.1)**.

---

## ✨ Features

- 📄 Upload PDF, PNG, or JPG resume
- 🎯 Enter target job title and job description
- 📊 Get Resume Score + ATS Score (0–100)
- 💪 See 3 key strengths
- 🔧 Get 4 detailed improvement suggestions
- 🌍 Supports 7 languages: English, Hindi, Spanish, German, Japanese, Portuguese, Dutch
- ⚡ Animated scanning screen while analyzing

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (single component) |
| Backend | Node.js + Express.js |
| AI Model | Llama 3.1 8B via Groq API |
| PDF Parsing | PDF.js (Mozilla) |
| Styling | Custom CSS-in-JS |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Himanshu76780/resume-analyzer.git
cd resume-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Groq API key

- Go to **https://console.groq.com**
- Sign up for free (no credit card needed)
- Click **API Keys** → **Create API Key**
- Copy your key

### 4. Add your API key

Open `server.js` and on line 9, replace the placeholder with your key:

```js
const GROQ_API_KEY = "your_groq_api_key_here";
```

### 5. Run the app

Open **two terminals**:

**Terminal 1 — Backend server:**
```bash
node server.js
```

**Terminal 2 — Frontend:**
```bash
npm start
```

The app will open at **http://localhost:3000**

---

## 📁 Project Structure

```
resume-analyzer/
├── src/
│   └── resume-analyzer.jsx   ← React frontend (entire UI)
├── server.js                 ← Node.js/Express backend + Groq API
├── package.json
└── README.md
```

---

## 🌍 Supported Languages

English 🇬🇧 · Hindi 🇮🇳 · Spanish 🇪🇸 · German 🇩🇪 · Japanese 🇯🇵 · Portuguese 🇧🇷 · Dutch 🇳🇱

---

## ⚠️ Important

- Never commit your actual API key to GitHub
- The `node_modules` folder is excluded via `.gitignore`
- Your resume is never stored — it is only read in memory during analysis

---

## 👨‍💻 Author

**Himanshu Yadav** — [GitHub](https://github.com/Himanshu76780)
