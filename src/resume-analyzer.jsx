import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    badge: "AI-POWERED ANALYSIS",
    title1: "Resume",
    title2: "Analyzer",
    subtitle: "Upload your resume, specify your target role, and get actionable insights to land your dream job.",
    feat1Title: "Deep Analysis", feat1Desc: "AI-powered resume parsing",
    feat2Title: "ATS Optimized", feat2Desc: "Beat applicant tracking systems",
    feat3Title: "Instant Results", feat3Desc: "Get feedback in seconds",
    uploadLabel: "Upload Resume",
    dropText: "Drop your resume here or",
    browse: "browse",
    fileHint: "PDF, PNG, or JPG — Max 10MB",
    jobTitleLabel: "Target Job Title",
    jobTitlePlaceholder: "e.g. Senior Software Engineer",
    jobDescLabel: "Job Description",
    jobDescHint: "(optional but recommended)",
    jobDescPlaceholder: "Paste the job description here for a more accurate analysis...",
    analyzeBtn: "Analyze Resume",
    analyzing: "Analyzing...",
    privacy: "Your resume is analyzed securely and never stored.",
    errFile: "Please upload a resume file.",
    errTitle: "Please enter a target job title.",
    errFailed: "Analysis failed. Please try again.",
    resultHeading: "Analysis Complete",
    resultSubheading: "Your Resume Report",
    resumeScore: "Resume Score",
    atsScore: "ATS Score",
    summaryTitle: "Resume Summary",
    strengthsTitle: "Key Strengths",
    improvementsTitle: "Areas to Improve",
    newAnalysis: "Start New Analysis",
    removeFile: "Remove",
    improveBtn: "✨ Improve My Resume",
    improvingText: "Rewriting your resume...",
    downloadBtn: "⬇ Download Improved Resume",
    improvedTitle: "Your Improved Resume",
    improvedSubtitle: "AI-rewritten and optimized for your target role",
  },
  hi: {
    badge: "AI-संचालित विश्लेषण",
    title1: "रिज्यूमे",
    title2: "विश्लेषक",
    subtitle: "अपना रिज्यूमे अपलोड करें, लक्ष्य भूमिका निर्दिष्ट करें और सपनों की नौकरी पाने के लिए उपयोगी सुझाव प्राप्त करें।",
    feat1Title: "गहरा विश्लेषण", feat1Desc: "AI-संचालित रिज्यूमे पार्सिंग",
    feat2Title: "ATS अनुकूलित", feat2Desc: "ट्रैकिंग सिस्टम को मात दें",
    feat3Title: "तुरंत परिणाम", feat3Desc: "सेकंडों में फीडबैक पाएं",
    uploadLabel: "रिज्यूमे अपलोड करें",
    dropText: "अपना रिज्यूमे यहाँ छोड़ें या",
    browse: "ब्राउज़ करें",
    fileHint: "PDF, PNG, या JPG — अधिकतम 10MB",
    jobTitleLabel: "लक्ष्य नौकरी शीर्षक",
    jobTitlePlaceholder: "जैसे. वरिष्ठ सॉफ्टवेयर इंजीनियर",
    jobDescLabel: "नौकरी विवरण",
    jobDescHint: "(वैकल्पिक लेकिन अनुशंसित)",
    jobDescPlaceholder: "अधिक सटीक विश्लेषण के लिए यहाँ नौकरी विवरण पेस्ट करें...",
    analyzeBtn: "रिज्यूमे विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    privacy: "आपका रिज्यूमे सुरक्षित रूप से विश्लेषित किया जाता है और कभी संग्रहीत नहीं किया जाता।",
    errFile: "कृपया एक रिज्यूमे फ़ाइल अपलोड करें।",
    errTitle: "कृपया लक्ष्य नौकरी शीर्षक दर्ज करें।",
    errFailed: "विश्लेषण विफल। कृपया पुनः प्रयास करें।",
    resultHeading: "विश्लेषण पूर्ण",
    resultSubheading: "आपकी रिज्यूमे रिपोर्ट",
    resumeScore: "रिज्यूमे स्कोर",
    atsScore: "ATS स्कोर",
    summaryTitle: "रिज्यूमे सारांश",
    strengthsTitle: "मुख्य ताकत",
    improvementsTitle: "सुधार के क्षेत्र",
    newAnalysis: "नया विश्लेषण शुरू करें",
    removeFile: "हटाएं",
    improveBtn: "✨ मेरा रिज्यूमे सुधारें",
    improvingText: "रिज्यूमे फिर से लिखा जा रहा है...",
    downloadBtn: "⬇ सुधरा हुआ रिज्यूमे डाउनलोड करें",
    improvedTitle: "आपका सुधरा हुआ रिज्यूमे",
    improvedSubtitle: "AI द्वारा पुनः लिखा और आपकी लक्षित भूमिका के लिए अनुकूलित",
  },
  es: {
    badge: "ANÁLISIS CON IA",
    title1: "Analizador de",
    title2: "Currículum",
    subtitle: "Sube tu currículum, especifica el puesto objetivo y obtén información práctica para conseguir el trabajo de tus sueños.",
    feat1Title: "Análisis Profundo", feat1Desc: "Análisis de currículum con IA",
    feat2Title: "Optimizado ATS", feat2Desc: "Supera los sistemas de rastreo",
    feat3Title: "Resultados Inmediatos", feat3Desc: "Obtén comentarios en segundos",
    uploadLabel: "Subir Currículum",
    dropText: "Suelta tu currículum aquí o",
    browse: "explorar",
    fileHint: "PDF, PNG o JPG — Máx 10MB",
    jobTitleLabel: "Cargo Objetivo",
    jobTitlePlaceholder: "ej. Ingeniero de Software Senior",
    jobDescLabel: "Descripción del Puesto",
    jobDescHint: "(opcional pero recomendado)",
    jobDescPlaceholder: "Pega la descripción del puesto aquí para un análisis más preciso...",
    analyzeBtn: "Analizar Currículum",
    analyzing: "Analizando...",
    privacy: "Tu currículum se analiza de forma segura y nunca se almacena.",
    errFile: "Por favor, sube un archivo de currículum.",
    errTitle: "Por favor, ingresa el cargo objetivo.",
    errFailed: "Análisis fallido. Por favor, inténtalo de nuevo.",
    resultHeading: "Análisis Completo",
    resultSubheading: "Tu Informe de Currículum",
    resumeScore: "Puntuación del Currículum",
    atsScore: "Puntuación ATS",
    summaryTitle: "Resumen del Currículum",
    strengthsTitle: "Fortalezas Clave",
    improvementsTitle: "Áreas de Mejora",
    newAnalysis: "Iniciar Nuevo Análisis",
    removeFile: "Eliminar",
    improveBtn: "✨ Mejorar Mi Currículum",
    improvingText: "Reescribiendo tu currículum...",
    downloadBtn: "⬇ Descargar Currículum Mejorado",
    improvedTitle: "Tu Currículum Mejorado",
    improvedSubtitle: "Reescrito con IA y optimizado para tu puesto objetivo",
  },
  de: {
    badge: "KI-GESTÜTZTE ANALYSE",
    title1: "Lebenslauf",
    title2: "Analysator",
    subtitle: "Lade deinen Lebenslauf hoch, gib deine Zielrolle an und erhalte umsetzbare Erkenntnisse für deinen Traumjob.",
    feat1Title: "Tiefenanalyse", feat1Desc: "KI-gestützte Lebenslaufanalyse",
    feat2Title: "ATS Optimiert", feat2Desc: "Bewerbersysteme überwinden",
    feat3Title: "Sofortige Ergebnisse", feat3Desc: "Feedback in Sekunden erhalten",
    uploadLabel: "Lebenslauf Hochladen",
    dropText: "Lebenslauf hier ablegen oder",
    browse: "durchsuchen",
    fileHint: "PDF, PNG oder JPG — Max 10MB",
    jobTitleLabel: "Ziel-Berufsbezeichnung",
    jobTitlePlaceholder: "z.B. Senior Software Engineer",
    jobDescLabel: "Stellenbeschreibung",
    jobDescHint: "(optional, aber empfohlen)",
    jobDescPlaceholder: "Füge die Stellenbeschreibung hier ein für eine genauere Analyse...",
    analyzeBtn: "Lebenslauf Analysieren",
    analyzing: "Analysiere...",
    privacy: "Dein Lebenslauf wird sicher analysiert und niemals gespeichert.",
    errFile: "Bitte lade eine Lebenslaufdatei hoch.",
    errTitle: "Bitte gib eine Ziel-Berufsbezeichnung ein.",
    errFailed: "Analyse fehlgeschlagen. Bitte versuche es erneut.",
    resultHeading: "Analyse Abgeschlossen",
    resultSubheading: "Dein Lebenslauf-Bericht",
    resumeScore: "Lebenslauf-Score",
    atsScore: "ATS-Score",
    summaryTitle: "Lebenslauf-Zusammenfassung",
    strengthsTitle: "Hauptstärken",
    improvementsTitle: "Verbesserungsbereiche",
    newAnalysis: "Neue Analyse Starten",
    removeFile: "Entfernen",
    improveBtn: "✨ Meinen Lebenslauf Verbessern",
    improvingText: "Lebenslauf wird neu geschrieben...",
    downloadBtn: "⬇ Verbesserten Lebenslauf Herunterladen",
    improvedTitle: "Dein Verbesserter Lebenslauf",
    improvedSubtitle: "KI-überarbeitet und für deine Zielrolle optimiert",
  },
  ja: {
    badge: "AI搭載分析",
    title1: "履歴書",
    title2: "アナライザー",
    subtitle: "履歴書をアップロードし、目標職種を指定して、夢の仕事を手に入れるための実用的なアドバイスを得ましょう。",
    feat1Title: "深層分析", feat1Desc: "AI搭載の履歴書解析",
    feat2Title: "ATS最適化", feat2Desc: "応募者追跡システムを突破",
    feat3Title: "即時結果", feat3Desc: "数秒でフィードバックを取得",
    uploadLabel: "履歴書をアップロード",
    dropText: "履歴書をここにドロップまたは",
    browse: "参照",
    fileHint: "PDF、PNG、またはJPG — 最大10MB",
    jobTitleLabel: "目標職種名",
    jobTitlePlaceholder: "例：シニアソフトウェアエンジニア",
    jobDescLabel: "求人内容",
    jobDescHint: "（任意だが推奨）",
    jobDescPlaceholder: "より正確な分析のために求人内容をここに貼り付けてください...",
    analyzeBtn: "履歴書を分析する",
    analyzing: "分析中...",
    privacy: "履歴書は安全に分析され、保存されることはありません。",
    errFile: "履歴書ファイルをアップロードしてください。",
    errTitle: "目標職種名を入力してください。",
    errFailed: "分析に失敗しました。もう一度お試しください。",
    resultHeading: "分析完了",
    resultSubheading: "あなたの履歴書レポート",
    resumeScore: "履歴書スコア",
    atsScore: "ATSスコア",
    summaryTitle: "履歴書サマリー",
    strengthsTitle: "主な強み",
    improvementsTitle: "改善点",
    newAnalysis: "新しい分析を開始",
    removeFile: "削除",
    improveBtn: "✨ 履歴書を改善する",
    improvingText: "履歴書を書き直しています...",
    downloadBtn: "⬇ 改善された履歴書をダウンロード",
    improvedTitle: "改善されたあなたの履歴書",
    improvedSubtitle: "AIによって書き直され、目標職種に最適化されました",
  },
  pt: {
    badge: "ANÁLISE COM IA",
    title1: "Analisador de",
    title2: "Currículo",
    subtitle: "Carregue seu currículo, especifique o cargo desejado e obtenha insights práticos para conquistar o emprego dos seus sonhos.",
    feat1Title: "Análise Profunda", feat1Desc: "Análise de currículo com IA",
    feat2Title: "Otimizado para ATS", feat2Desc: "Supere os sistemas de rastreamento",
    feat3Title: "Resultados Instantâneos", feat3Desc: "Obtenha feedback em segundos",
    uploadLabel: "Carregar Currículo",
    dropText: "Solte seu currículo aqui ou",
    browse: "procurar",
    fileHint: "PDF, PNG ou JPG — Máx 10MB",
    jobTitleLabel: "Cargo Alvo",
    jobTitlePlaceholder: "ex. Engenheiro de Software Sênior",
    jobDescLabel: "Descrição da Vaga",
    jobDescHint: "(opcional, mas recomendado)",
    jobDescPlaceholder: "Cole a descrição da vaga aqui para uma análise mais precisa...",
    analyzeBtn: "Analisar Currículo",
    analyzing: "Analisando...",
    privacy: "Seu currículo é analisado com segurança e nunca é armazenado.",
    errFile: "Por favor, carregue um arquivo de currículo.",
    errTitle: "Por favor, insira o cargo alvo.",
    errFailed: "Análise falhou. Por favor, tente novamente.",
    resultHeading: "Análise Concluída",
    resultSubheading: "Seu Relatório de Currículo",
    resumeScore: "Pontuação do Currículo",
    atsScore: "Pontuação ATS",
    summaryTitle: "Resumo do Currículo",
    strengthsTitle: "Pontos Fortes",
    improvementsTitle: "Áreas de Melhoria",
    newAnalysis: "Iniciar Nova Análise",
    removeFile: "Remover",
    improveBtn: "✨ Melhorar Meu Currículo",
    improvingText: "Reescrevendo seu currículo...",
    downloadBtn: "⬇ Baixar Currículo Melhorado",
    improvedTitle: "Seu Currículo Melhorado",
    improvedSubtitle: "Reescrito com IA e otimizado para seu cargo alvo",
  },
  nl: {
    badge: "AI-GESTUURDE ANALYSE",
    title1: "CV",
    title2: "Analysator",
    subtitle: "Upload je cv, geef je doelfunctie op en ontvang bruikbare inzichten om je droombaan te vinden.",
    feat1Title: "Diepgaande Analyse", feat1Desc: "AI-gestuurde cv-verwerking",
    feat2Title: "ATS Geoptimaliseerd", feat2Desc: "Versla sollicitatiesystemen",
    feat3Title: "Direct Resultaat", feat3Desc: "Ontvang feedback in seconden",
    uploadLabel: "CV Uploaden",
    dropText: "Sleep je cv hierheen of",
    browse: "bladeren",
    fileHint: "PDF, PNG of JPG — Max 10MB",
    jobTitleLabel: "Doelfunctietitel",
    jobTitlePlaceholder: "bijv. Senior Software Engineer",
    jobDescLabel: "Functieomschrijving",
    jobDescHint: "(optioneel maar aanbevolen)",
    jobDescPlaceholder: "Plak hier de functieomschrijving voor een nauwkeurigere analyse...",
    analyzeBtn: "CV Analyseren",
    analyzing: "Analyseren...",
    privacy: "Je cv wordt veilig geanalyseerd en nooit opgeslagen.",
    errFile: "Upload een cv-bestand.",
    errTitle: "Voer een doelfunctietitel in.",
    errFailed: "Analyse mislukt. Probeer het opnieuw.",
    resultHeading: "Analyse Voltooid",
    resultSubheading: "Jouw CV-rapport",
    resumeScore: "CV Score",
    atsScore: "ATS Score",
    summaryTitle: "CV Samenvatting",
    strengthsTitle: "Belangrijkste Sterke Punten",
    improvementsTitle: "Verbeterpunten",
    newAnalysis: "Nieuwe Analyse Starten",
    removeFile: "Verwijderen",
    improveBtn: "✨ Mijn CV Verbeteren",
    improvingText: "CV wordt herschreven...",
    downloadBtn: "⬇ Verbeterd CV Downloaden",
    improvedTitle: "Jouw Verbeterd CV",
    improvedSubtitle: "AI-herschreven en geoptimaliseerd voor jouw doelfunctie",
  },
};

const LANG_OPTIONS = [
  { code: "en", flag: "🇺🇸", label: "English"    },
  { code: "hi", flag: "🇮🇳", label: "हिंदी"       },
  { code: "es", flag: "🇪🇸", label: "Español"    },
  { code: "de", flag: "🇩🇪", label: "Deutsch"    },
  { code: "ja", flag: "🇯🇵", label: "日本語"      },
  { code: "pt", flag: "🇧🇷", label: "Português"  },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
];

/* ═══════════════════════════════════════════════════════════
   SCORE RING
═══════════════════════════════════════════════════════════ */
function ScoreRing({ score, label, color, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const R = 52;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    setDisplayed(0);
    let raf;
    let start = null;
    const dur = 1400;
    const timer = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * score));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [score, delay]);

  const colorMap = { teal: "#00d4aa", amber: "#f59e0b" };
  const clr = colorMap[color] || color;
  const offset = C - (displayed / 100) * C;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
      <div style={{ position:"relative", width:140, height:140 }}>
        <svg width="140" height="140" style={{ transform:"rotate(-90deg)",
          filter:`drop-shadow(0 0 14px ${clr}55)` }}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="70" cy="70" r={R} fill="none" stroke={clr} strokeWidth="10"
            strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:32, fontWeight:800, color:"#f1f5f9",
            fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>{displayed}</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>/100</span>
        </div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#94a3b8",
          letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
        <div style={{ fontSize:12, color:clr, fontWeight:600, marginTop:4 }}>
          {displayed >= 80 ? "●●●●●" : displayed >= 60 ? "●●●●○" : displayed >= 40 ? "●●●○○" : "●●○○○"}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESUME SECTION HELPER
═══════════════════════════════════════════════════════════ */
function ResumeSection({ title, icon, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12,
        paddingBottom:8, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontSize:15 }}>{icon}</span>
        <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
          fontSize:13, color:"#94a3b8", letterSpacing:"0.08em",
          textTransform:"uppercase" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function ResumeAnalyzer() {
  const [lang, setLang]         = useState("en");
  const [file, setFile]         = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc]   = useState("");
  const [loading, setLoading]           = useState(false);
  const [scanning, setScanning]         = useState(false);
  const [scanStep, setScanStep]         = useState(0);
  const [pendingResult, setPendingResult] = useState(null);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState("");
  const [dragOver, setDragOver]         = useState(false);
  const [improving, setImproving]       = useState(false);
  const [improvedResume, setImprovedResume] = useState(null);
  const fileRef = useRef(null);

  // t is always in sync with lang — no custom dropdown state needed
  const t = TRANSLATIONS[lang];
  const currentLang = LANG_OPTIONS.find(l => l.code === lang);

  const handleLangChange = (e) => {
    setLang(e.target.value);
    setError("");
  };

  /* ── File helpers ── */
  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(f.type)) { setError("Please upload a PDF, PNG, or JPG file."); return; }
    if (f.size > 10 * 1024 * 1024) { setError("File size must be under 10MB."); return; }
    setFile(f);
    setError("");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const extractText = async (f) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(" ") + "\n";
          }
          resolve(fullText);
        } catch (err) {
          resolve("Could not extract text from PDF.");
        }
      };
      reader.readAsArrayBuffer(f);
    });
  };

  /* ── Analysis ── */
  const analyze = async () => {
    setError("");
    if (!file) { setError(t.errFile); return; }
    if (!jobTitle.trim()) { setError(t.errTitle); return; }
    setLoading(true);
    setScanning(true);
    setScanStep(0);
    setPendingResult(null);

    // Start scan step animation
    const stepTimings = [0, 900, 1800, 2700];
    stepTimings.forEach((delay, i) => {
      setTimeout(() => setScanStep(i + 1), delay);
    });

    try {
      const resumeText = await extractText(file);

      const langName = currentLang?.label || "English";
      const langCode = lang;

      const prompt = `You are an expert resume analyst. Here is the resume text:

--- RESUME START ---
${resumeText}
--- RESUME END ---

Target Job Title: ${jobTitle}
${jobDesc ? `Job Description:\n${jobDesc}` : ""}

CRITICAL INSTRUCTION: You MUST write every single word of your response in ${langName} (language code: ${langCode}). 
Do NOT use English at all unless ${langName} is English.
Every string value in the JSON must be fully written in ${langName}.

Respond ONLY with a valid JSON object — no markdown fences, no extra text. Exact structure:
{
  "resumeScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "summary": "<2-3 sentences in ${langName} ONLY>",
  "strengths": [
    "<strength 1 in ${langName}>",
    "<strength 2 in ${langName}>",
    "<strength 3 in ${langName}>"
  ],
  "improvements": [
    { "title": "<short title in ${langName}>", "description": "<detailed explanation in ${langName}>" },
    { "title": "<short title in ${langName}>", "description": "<detailed explanation in ${langName}>" },
    { "title": "<short title in ${langName}>", "description": "<detailed explanation in ${langName}>" },
    { "title": "<short title in ${langName}>", "description": "<detailed explanation in ${langName}>" }
  ]
}

Scoring:
- resumeScore: overall quality, formatting, clarity, relevance, quantifiable achievements (0-100)
- atsScore: keyword density, proper section headers, no tables or graphics (0-100)

REMINDER: Every piece of text must be in ${langName}. No English allowed unless ${langName} is English.`;

      const [res] = await Promise.all([
        fetch("http://localhost:3001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
        new Promise(resolve => setTimeout(resolve, 3500)),
      ]);

      const data = await res.json();

      if (data.error) {
        setScanning(false);
        setError("API Error: " + data.error);
        return;
      }

      const raw = data.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setScanStep(5);
      setTimeout(() => {
        setScanning(false);
        setResult(parsed);
      }, 600);

    } catch (err) {
      console.error(err);
      setScanning(false);
      setError(t.errFailed);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null); setFile(null);
    setJobTitle(""); setJobDesc(""); setError("");
    setImprovedResume(null);
  };

  /* ── Improve Resume ── */
  const improveResume = async () => {
    setImproving(true);
    setImprovedResume(null);
    try {
      const resumeText = await extractText(file);
      const prompt = `You are an expert resume writer. Rewrite and significantly improve the following resume for the target job role.

--- ORIGINAL RESUME ---
${resumeText}
--- END RESUME ---

Target Job Title: ${jobTitle}
${jobDesc ? `Job Description:\n${jobDesc}` : ""}

Rewrite this resume to be highly tailored, professional, and ATS-optimized for the target role.
Improve bullet points with strong action verbs and quantifiable achievements where possible.
Keep all real information — do not fabricate facts, companies, or dates.

Respond ONLY with a valid JSON object in this exact structure, no markdown fences:
{
  "name": "<full name from resume>",
  "contact": "<email | phone | location | linkedin — all on one line>",
  "summary": "<3-4 sentence professional summary tailored to ${jobTitle}>",
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "duration": "<start – end>",
      "bullets": ["<bullet 1>", "<bullet 2>", "<bullet 3>"]
    }
  ],
  "education": [
    {
      "degree": "<degree and field>",
      "school": "<institution name>",
      "year": "<graduation year or expected>"
    }
  ],
  "skills": "<comma-separated list of relevant skills>",
  "projects": [
    {
      "name": "<project name>",
      "description": "<1-2 sentence description with tech stack>"
    }
  ]
}`;

      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) { setError("Improve Error: " + data.error); return; }
      const raw = data.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      setImprovedResume(JSON.parse(clean));
    } catch (err) {
      console.error(err);
      setError("Failed to improve resume. Please try again.");
    } finally {
      setImproving(false);
    }
  };

  /* ── Download as HTML/PDF ── */
  const downloadResume = () => {
    const r = improvedResume;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${r.name} — Resume</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Georgia', serif; background:#fff; color:#1a1a1a; padding:48px 56px; max-width:860px; margin:0 auto; font-size:14px; line-height:1.6; }
  h1 { font-size:28px; font-weight:bold; color:#0f172a; letter-spacing:0.02em; }
  .contact { color:#475569; font-size:13px; margin-top:4px; }
  hr { border:none; border-top:2px solid #0f172a; margin:18px 0 14px; }
  .section-title { font-size:13px; font-weight:bold; color:#0f172a; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; }
  .summary { color:#374151; margin-bottom:22px; line-height:1.75; }
  .job { margin-bottom:18px; }
  .job-header { display:flex; justify-content:space-between; align-items:baseline; }
  .job-title { font-weight:bold; color:#0f172a; font-size:15px; }
  .job-company { color:#475569; font-size:13px; }
  .job-duration { color:#94a3b8; font-size:12px; }
  ul { padding-left:18px; margin-top:6px; }
  li { color:#374151; margin-bottom:3px; }
  .edu-item { display:flex; justify-content:space-between; margin-bottom:8px; }
  .degree { font-weight:bold; color:#0f172a; }
  .school { color:#475569; font-size:13px; }
  .year { color:#94a3b8; font-size:12px; }
  .skills { color:#374151; }
  .project { margin-bottom:10px; }
  .project-name { font-weight:bold; color:#0f172a; }
  .project-desc { color:#475569; font-size:13px; }
  section { margin-bottom:22px; }
  @media print {
    body { padding: 32px 40px; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
  <h1>${r.name}</h1>
  <div class="contact">${r.contact}</div>
  <hr/>

  <section>
    <div class="section-title">Professional Summary</div>
    <p class="summary">${r.summary}</p>
  </section>

  ${r.experience && r.experience.length > 0 ? `
  <section>
    <div class="section-title">Experience</div>
    ${r.experience.map(exp => `
      <div class="job">
        <div class="job-header">
          <div>
            <span class="job-title">${exp.title}</span>
            <span class="job-company"> — ${exp.company}</span>
          </div>
          <span class="job-duration">${exp.duration}</span>
        </div>
        <ul>${(exp.bullets || []).map(b => `<li>${b}</li>`).join("")}</ul>
      </div>
    `).join("")}
  </section>` : ""}

  ${r.projects && r.projects.length > 0 ? `
  <section>
    <div class="section-title">Projects</div>
    ${r.projects.map(p => `
      <div class="project">
        <div class="project-name">${p.name}</div>
        <div class="project-desc">${p.description}</div>
      </div>
    `).join("")}
  </section>` : ""}

  ${r.education && r.education.length > 0 ? `
  <section>
    <div class="section-title">Education</div>
    ${r.education.map(e => `
      <div class="edu-item">
        <div>
          <div class="degree">${e.degree}</div>
          <div class="school">${e.school}</div>
        </div>
        <div class="year">${e.year}</div>
      </div>
    `).join("")}
  </section>` : ""}

  <section>
    <div class="section-title">Skills</div>
    <div class="skills">${r.skills}</div>
  </section>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.name.replace(/\s+/g, "_")}_Improved_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ═══════════════ STYLES ═══════════════ */
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #060d1a; font-family: 'Manrope', sans-serif; color: #e2e8f0; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: rgba(0,212,170,0.3); border-radius: 3px; }
    input, textarea, select { font-family: 'Manrope', sans-serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fu  { animation: fadeUp 0.5s ease forwards; opacity: 0; }
    .d1  { animation-delay: 0.07s; }
    .d2  { animation-delay: 0.14s; }
    .d3  { animation-delay: 0.22s; }
    .d4  { animation-delay: 0.30s; }
    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      backdrop-filter: blur(10px);
    }
    .lang-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .lang-flag {
      position: absolute;
      left: 12px;
      font-size: 18px;
      pointer-events: none;
      z-index: 2;
    }
    .lang-arrow {
      position: absolute;
      right: 12px;
      color: rgba(255,255,255,0.4);
      font-size: 11px;
      pointer-events: none;
      z-index: 2;
    }
    .lang-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      padding: 10px 38px 10px 40px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      min-width: 155px;
      position: relative;
      z-index: 1;
    }
    .lang-select:hover  { background: rgba(255,255,255,0.11); border-color: rgba(0,212,170,0.4); }
    .lang-select:focus  { border-color: #00d4aa; box-shadow: 0 0 0 3px rgba(0,212,170,0.15); }
    .lang-select option { background: #0d1b2e; color: #e2e8f0; padding: 8px; }
    .upload-zone {
      border: 2px dashed rgba(0,212,170,0.25);
      border-radius: 18px;
      padding: 46px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      text-align: center;
      transition: all 0.22s;
      background: rgba(0,212,170,0.02);
    }
    .upload-zone:hover, .drag-over {
      border-color: rgba(0,212,170,0.6) !important;
      background: rgba(0,212,170,0.06) !important;
      box-shadow: 0 0 28px rgba(0,212,170,0.08);
    }
    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .inp {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      color: #f1f5f9;
      font-size: 15px;
      padding: 14px 18px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .inp::placeholder { color: rgba(255,255,255,0.22); }
    .inp:focus { border-color: rgba(0,212,170,0.5); box-shadow: 0 0 0 3px rgba(0,212,170,0.1); }
    .btn-main {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #00d4aa, #0098d4);
      border: none;
      border-radius: 14px;
      color: #060d1a;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,212,170,0.3); }
    .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-reset {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      color: #e2e8f0;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-reset:hover { background: rgba(255,255,255,0.1); }
    .strength-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: rgba(0,212,170,0.07);
      border: 1px solid rgba(0,212,170,0.18);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 13px;
      color: #a7f3e4;
      line-height: 1.55;
    }
    .improve-item {
      display: flex;
      gap: 14px;
      background: rgba(245,158,11,0.05);
      border: 1px solid rgba(245,158,11,0.14);
      border-radius: 14px;
      padding: 18px;
    }
    .improve-num {
      min-width: 28px;
      height: 28px;
      background: rgba(245,158,11,0.14);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: #f59e0b;
      flex-shrink: 0;
    }
    .err-box {
      background: rgba(244,63,94,0.1);
      border: 1px solid rgba(244,63,94,0.25);
      border-radius: 12px;
      padding: 13px 18px;
      font-size: 13px;
      color: #f87171;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
    }
    .mesh { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
    .blob { position:absolute; border-radius:50%; filter:blur(90px); }
  `;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <>
      <style>{styles}</style>

      <div className="mesh">
        <div className="blob" style={{ width:550, height:550, top:"-180px", left:"-150px", background:"#00d4aa", opacity:0.07 }} />
        <div className="blob" style={{ width:400, height:400, bottom:"80px", right:"-100px", background:"#0098d4", opacity:0.07 }} />
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:760, margin:"0 auto", padding:"28px 18px 72px" }}>

        {/* ══════════════ LANGUAGE SELECTOR ══════════════ */}
        <div className="fu" style={{ display:"flex", justifyContent:"flex-end", marginBottom:28 }}>
          <div className="lang-wrapper">
            <span className="lang-flag">{currentLang?.flag}</span>
            <select
              className="lang-select"
              value={lang}
              onChange={handleLangChange}
            >
              {LANG_OPTIONS.map(l => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <span className="lang-arrow">▾</span>
          </div>
        </div>

        {scanning ? (
          /* ══════════════ SCANNING SCREEN ══════════════ */
          <div className="card fu" style={{ padding:"60px 40px", textAlign:"center", marginBottom:18 }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ position:"relative", width:100, height:100, margin:"0 auto 28px" }}>
                <svg viewBox="0 0 100 100" style={{ width:100, height:100, transform:"rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,212,170,0.12)" strokeWidth="6"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#00d4aa" strokeWidth="6"
                    strokeDasharray="264" strokeDashoffset={264 - (264 * Math.min(scanStep, 4) / 4)}
                    style={{ transition:"stroke-dashoffset 0.8s ease" }}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22, fontWeight:800, color:"#00d4aa",
                  fontFamily:"'Outfit',sans-serif" }}>
                  {Math.round(Math.min(scanStep, 4) / 4 * 100)}%
                </div>
              </div>

              <div style={{ fontSize:20, fontWeight:700, color:"#f1f5f9",
                fontFamily:"'Outfit',sans-serif", marginBottom:8 }}>
                Scanning Resume...
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:36 }}>
                AI is analyzing your document
              </div>

              {[
                { label: "Reading document structure", icon: "📄" },
                { label: "Extracting key information", icon: "🔍" },
                { label: "Matching against job requirements", icon: "🎯" },
                { label: "Generating ATS score", icon: "📊" },
              ].map((step, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:14,
                  padding:"12px 20px", borderRadius:12, marginBottom:10,
                  background: scanStep > i ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.02)",
                  border: scanStep > i ? "1px solid rgba(0,212,170,0.2)" : "1px solid rgba(255,255,255,0.05)",
                  transition:"all 0.4s ease",
                  opacity: scanStep > i ? 1 : 0.35,
                }}>
                  <span style={{ fontSize:18 }}>{step.icon}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: scanStep > i ? "#00d4aa" : "rgba(255,255,255,0.4)",
                    transition:"color 0.4s ease", flex:1, textAlign:"left" }}>
                    {step.label}
                  </span>
                  {scanStep > i && (
                    <span style={{ fontSize:16, color:"#00d4aa" }}>✓</span>
                  )}
                  {scanStep === i + 1 && (
                    <span style={{ display:"inline-block", width:14, height:14,
                      border:"2px solid rgba(0,212,170,0.3)", borderTopColor:"#00d4aa",
                      borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

        ) : !result ? (
          <>
            {/* ══════════════ HERO ══════════════ */}
            <div className="fu d1" style={{ textAlign:"center", marginBottom:44 }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(0,212,170,0.1)", border:"1px solid rgba(0,212,170,0.2)",
                borderRadius:999, padding:"6px 16px", fontSize:11, fontWeight:700,
                letterSpacing:"0.1em", color:"#00d4aa", marginBottom:22, textTransform:"uppercase"
              }}>
                <span>✦</span><span>{t.badge}</span>
              </div>

              <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, lineHeight:1.1, marginBottom:18 }}>
                <span style={{ fontSize:"clamp(40px,7vw,66px)", color:"#f1f5f9", display:"block" }}>
                  {t.title1}
                </span>
                <span style={{
                  fontSize:"clamp(40px,7vw,66px)", display:"block",
                  background:"linear-gradient(135deg,#00d4aa,#0098d4)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
                }}>
                  {t.title2}
                </span>
              </h1>

              <p style={{ fontSize:16, color:"rgba(255,255,255,0.42)", maxWidth:500,
                margin:"0 auto", lineHeight:1.75 }}>{t.subtitle}</p>
            </div>

            {/* ══════════════ FEATURE CHIPS ══════════════ */}
            <div className="fu d2" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
              gap:12, marginBottom:36 }}>
              {[
                { icon:"◈", title:t.feat1Title, desc:t.feat1Desc },
                { icon:"◎", title:t.feat2Title, desc:t.feat2Desc },
                { icon:"◆", title:t.feat3Title, desc:t.feat3Desc },
              ].map((f, i) => (
                <div key={i} className="card" style={{ padding:"14px 16px", display:"flex",
                  alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18, color:"#00d4aa", flexShrink:0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{f.title}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.32)", marginTop:2 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════ FORM CARD ══════════════ */}
            <div className="card fu d3" style={{ padding:32 }}>

              {/* Upload */}
              <div style={{ marginBottom:24 }}>
                <label className="field-label">{t.uploadLabel}</label>
                <div
                  className={`upload-zone${dragOver ? " drag-over" : ""}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg"
                    style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

                  {file ? (
                    <>
                      <div style={{ width:54, height:54, background:"rgba(0,212,170,0.14)",
                        borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:24 }}>📄</div>
                      <div>
                        <div style={{ fontWeight:700, color:"#00d4aa", fontSize:15 }}>{file.name}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.32)", marginTop:4 }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setFile(null); }}
                        style={{ background:"rgba(244,63,94,0.13)", border:"1px solid rgba(244,63,94,0.28)",
                          borderRadius:8, color:"#f43f5e", padding:"6px 14px", cursor:"pointer",
                          fontSize:12, fontWeight:600, fontFamily:"'Manrope',sans-serif" }}>
                        {t.removeFile}
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ width:60, height:60, background:"rgba(0,212,170,0.1)",
                        borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="#00d4aa"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 16.5V18.75C3 19.993 4.007 21 5.25 21H18.75C19.993 21 21 19.993 21 18.75V16.5"
                            stroke="#00d4aa" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontWeight:700, color:"#f1f5f9", fontSize:15 }}>
                          {t.dropText}{" "}
                        </span>
                        <span style={{ color:"#00d4aa", fontWeight:700, fontSize:15,
                          borderBottom:"1px solid rgba(0,212,170,0.4)" }}>{t.browse}</span>
                      </div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.28)" }}>{t.fileHint}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Job title */}
              <div style={{ marginBottom:18 }}>
                <label className="field-label">{t.jobTitleLabel} *</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:16, top:"50%",
                    transform:"translateY(-50%)", fontSize:16, opacity:0.35 }}>💼</span>
                  <input className="inp" value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder={t.jobTitlePlaceholder}
                    style={{ paddingLeft:44 }} />
                </div>
              </div>

              {/* Job description */}
              <div style={{ marginBottom:26 }}>
                <label className="field-label" style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {t.jobDescLabel}
                  <span style={{ color:"rgba(255,255,255,0.28)", fontSize:11, fontWeight:500,
                    textTransform:"none", letterSpacing:0 }}>{t.jobDescHint}</span>
                </label>
                <textarea className="inp" rows={5} value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder={t.jobDescPlaceholder}
                  style={{ resize:"vertical", lineHeight:1.65 }} />
              </div>

              {error && (
                <div className="err-box"><span>⚠</span><span>{error}</span></div>
              )}

              <button className="btn-main" onClick={analyze} disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ display:"inline-block", width:17, height:17,
                      border:"2.5px solid rgba(0,0,0,0.25)", borderTopColor:"#060d1a",
                      borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                    {t.analyzing}
                  </>
                ) : (
                  <><span>✦</span>{t.analyzeBtn}</>
                )}
              </button>

              <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.18)",
                marginTop:14, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>🔒</span>{t.privacy}
              </p>
            </div>
          </>

        ) : (

          /* ══════════════ RESULTS ══════════════ */
          <div>
            <div className="card fu" style={{ padding:40, marginBottom:18, textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#00d4aa",
                letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                ✦ {t.resultHeading}
              </div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
                fontSize:26, color:"#f1f5f9", marginBottom:34 }}>{t.resultSubheading}</h2>

              <div style={{ display:"flex", justifyContent:"center", gap:56, flexWrap:"wrap" }}>
                <ScoreRing score={result.resumeScore} label={t.resumeScore} color="teal" delay={200} />
                <ScoreRing score={result.atsScore}    label={t.atsScore}    color="amber" delay={500} />
              </div>

              <div style={{ display:"flex", justifyContent:"center", gap:24,
                marginTop:26, flexWrap:"wrap" }}>
                {[["#00d4aa", `${t.resumeScore}: ${result.resumeScore}/100`],
                  ["#f59e0b", `${t.atsScore}: ${result.atsScore}/100`]].map(([c, l], i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7,
                    fontSize:13, color:"rgba(255,255,255,0.45)" }}>
                    <span style={{ width:9, height:9, borderRadius:"50%",
                      background:c, display:"inline-block" }} />{l}
                  </div>
                ))}
              </div>
            </div>

            <div className="card fu d1" style={{ padding:26, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>📋</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#f1f5f9" }}>{t.summaryTitle}</h3>
              </div>
              <p style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.8, fontSize:14 }}>
                {result.summary}
              </p>
            </div>

            <div className="card fu d2" style={{ padding:26, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:18 }}>🌟</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#f1f5f9" }}>{t.strengthsTitle}</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(result.strengths || []).map((s, i) => (
                  <div key={i} className="strength-item">
                    <span style={{ color:"#00d4aa", fontWeight:800, minWidth:20 }}>{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card fu d3" style={{ padding:26, marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:18 }}>🔧</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#f1f5f9" }}>{t.improvementsTitle}</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {(result.improvements || []).map((item, i) => (
                  <div key={i} className="improve-item">
                    <div className="improve-num">{i + 1}</div>
                    <div>
                      <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:14, marginBottom:6 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.48)", lineHeight:1.7 }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fu d4" style={{ textAlign:"center", display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
              <button className="btn-main" onClick={improveResume} disabled={improving}
                style={{ maxWidth:360 }}>
                {improving ? (
                  <>
                    <span style={{ display:"inline-block", width:17, height:17,
                      border:"2.5px solid rgba(0,0,0,0.25)", borderTopColor:"#060d1a",
                      borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                    {t.improvingText}
                  </>
                ) : t.improveBtn}
              </button>
              <button className="btn-reset" onClick={reset}>{t.newAnalysis}</button>
            </div>

            {/* ══ IMPROVED RESUME ══ */}
            {improvedResume && (
              <div className="card fu" style={{ padding:32, marginTop:24 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  flexWrap:"wrap", gap:14, marginBottom:24 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#00d4aa",
                      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                      ✦ {t.improvedTitle}
                    </div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>{t.improvedSubtitle}</div>
                  </div>
                  <button className="btn-main" onClick={downloadResume}
                    style={{ width:"auto", padding:"12px 22px", fontSize:13 }}>
                    {t.downloadBtn}
                  </button>
                </div>

                {/* Name & Contact */}
                <div style={{ borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:18, marginBottom:20 }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:"#f1f5f9" }}>
                    {improvedResume.name}
                  </div>
                  <div style={{ fontSize:13, color:"#00d4aa", marginTop:4 }}>{improvedResume.contact}</div>
                </div>

                {/* Summary */}
                <ResumeSection title="Professional Summary" icon="📋">
                  <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.8, fontSize:14 }}>{improvedResume.summary}</p>
                </ResumeSection>

                {/* Experience */}
                {improvedResume.experience?.length > 0 && (
                  <ResumeSection title="Experience" icon="💼">
                    {improvedResume.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom:16 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
                          <div>
                            <span style={{ fontWeight:700, color:"#f1f5f9", fontSize:14 }}>{exp.title}</span>
                            <span style={{ color:"#00d4aa", fontSize:13 }}> — {exp.company}</span>
                          </div>
                          <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{exp.duration}</span>
                        </div>
                        <ul style={{ paddingLeft:18, marginTop:6 }}>
                          {(exp.bullets || []).map((b, j) => (
                            <li key={j} style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:3, lineHeight:1.6 }}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </ResumeSection>
                )}

                {/* Projects */}
                {improvedResume.projects?.length > 0 && (
                  <ResumeSection title="Projects" icon="🚀">
                    {improvedResume.projects.map((p, i) => (
                      <div key={i} style={{ marginBottom:10 }}>
                        <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:13 }}>{p.name}</div>
                        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.6 }}>{p.description}</div>
                      </div>
                    ))}
                  </ResumeSection>
                )}

                {/* Education */}
                {improvedResume.education?.length > 0 && (
                  <ResumeSection title="Education" icon="🎓">
                    {improvedResume.education.map((e, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:4 }}>
                        <div>
                          <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:13 }}>{e.degree}</div>
                          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>{e.school}</div>
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>{e.year}</div>
                      </div>
                    ))}
                  </ResumeSection>
                )}

                {/* Skills */}
                <ResumeSection title="Skills" icon="⚡">
                  <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.8 }}>{improvedResume.skills}</div>
                </ResumeSection>

                <div style={{ textAlign:"center", marginTop:8 }}>
                  <button className="btn-main" onClick={downloadResume}
                    style={{ width:"auto", padding:"14px 32px" }}>
                    {t.downloadBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}