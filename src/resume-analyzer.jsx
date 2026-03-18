import { useState, useRef, useCallback, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as fbSignInEmail,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "firebase/auth";

/* ─────────────────────────────────────────────────────────
   PASTE YOUR FIREBASE CONFIG HERE
   Get it from: console.firebase.google.com
   → Project Settings → Your apps → </> → firebaseConfig
───────────────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDtQBsK3T36WVK0oEAdc200SAUMuofpV_0",
  authDomain: "resume-analyzer-e6040.firebaseapp.com",
  projectId: "resume-analyzer-e6040",
  storageBucket: "resume-analyzer-e6040.firebasestorage.app",
  messagingSenderId: "842186449541",
  appId: "1:842186449541:web:cef8e5d338fd562ac17fec",
  measurementId: "G-BV2X45KGE7"
};

const app        = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const auth       = getAuth(app);
const gProvider  = new GoogleAuthProvider();

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
    errNotResume: "This document does not appear to be a resume. Please upload a valid resume with sections like Experience, Education, Skills, and personal contact details.",
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
    scanTitle: "Scanning Resume...",
    scanSubtitle: "AI is analyzing your document",
    scanStep1: "Reading document structure",
    scanStep2: "Extracting keywords & skills",
    scanStep3: "Matching against job requirements",
    scanStep4: "Generating scores & insights",
    resumeScoreDesc: "How well your resume matches the job title, description, and required keywords",
    atsScoreDesc: "How well your resume is structured, formatted, and optimized for ATS systems",
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to save your analyses and track your progress",
    loginEmail: "Email address",
    loginBtn: "Continue with Email",
    loginGoogle: "Continue with Google",
    loginOr: "or",
    loginSwitch: "Don't have an account?",
    loginSwitchLink: "Sign up",
    signupSwitch: "Already have an account?",
    signupSwitchLink: "Sign in",
    skipLogin: "Skip for now",
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
    errNotResume: "यह दस्तावेज़ रिज्यूमे नहीं लगता। कृपया अनुभव, शिक्षा और संपर्क विवरण वाला वैध रिज्यूमे अपलोड करें।",
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
    scanTitle: "रिज्यूमे स्कैन हो रहा है...",
    scanSubtitle: "AI आपके दस्तावेज़ का विश्लेषण कर रहा है",
    scanStep1: "दस्तावेज़ संरचना पढ़ना",
    scanStep2: "कीवर्ड और कौशल निकालना",
    scanStep3: "नौकरी की आवश्यकताओं से मिलान",
    scanStep4: "स्कोर और अंतर्दृष्टि तैयार करना",
    resumeScoreDesc: "आपका रिज्यूमे नौकरी शीर्षक, विवरण और कीवर्ड से कितना मेल खाता है",
    atsScoreDesc: "आपका रिज्यूमे ATS सिस्टम के लिए कितना अच्छी तरह संरचित और अनुकूलित है",
    loginTitle: "वापस स्वागत है",
    loginSubtitle: "अपने विश्लेषण सहेजने के लिए साइन इन करें",
    loginEmail: "ईमेल पता",
    loginBtn: "ईमेल से जारी रखें",
    loginGoogle: "Google से जारी रखें",
    loginOr: "या",
    loginSwitch: "खाता नहीं है?",
    loginSwitchLink: "साइन अप करें",
    signupSwitch: "पहले से खाता है?",
    signupSwitchLink: "साइन इन करें",
    skipLogin: "अभी छोड़ें",
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
    errNotResume: "Este documento no parece ser un currículum. Por favor, sube un currículum válido con secciones de Experiencia, Educación y datos de contacto.",
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
    scanTitle: "Escaneando Currículum...",
    scanSubtitle: "La IA está analizando tu documento",
    scanStep1: "Leyendo la estructura del documento",
    scanStep2: "Extrayendo palabras clave y habilidades",
    scanStep3: "Comparando con los requisitos del puesto",
    scanStep4: "Generando puntuaciones e ideas",
    resumeScoreDesc: "Qué tan bien coincide tu currículum con el puesto, descripción y palabras clave",
    atsScoreDesc: "Qué tan bien está estructurado y optimizado tu currículum para sistemas ATS",
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle: "Inicia sesión para guardar tus análisis",
    loginEmail: "Correo electrónico",
    loginBtn: "Continuar con correo",
    loginGoogle: "Continuar con Google",
    loginOr: "o",
    loginSwitch: "¿No tienes cuenta?",
    loginSwitchLink: "Regístrate",
    signupSwitch: "¿Ya tienes cuenta?",
    signupSwitchLink: "Inicia sesión",
    skipLogin: "Omitir por ahora",
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
    errNotResume: "Dieses Dokument scheint kein Lebenslauf zu sein. Bitte lade einen gültigen Lebenslauf mit Abschnitten wie Erfahrung, Bildung und Kontaktdaten hoch.",
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
    scanTitle: "Lebenslauf wird gescannt...",
    scanSubtitle: "KI analysiert dein Dokument",
    scanStep1: "Dokumentstruktur lesen",
    scanStep2: "Schlüsselwörter und Fähigkeiten extrahieren",
    scanStep3: "Abgleich mit Jobanforderungen",
    scanStep4: "Bewertungen und Erkenntnisse generieren",
    resumeScoreDesc: "Wie gut dein Lebenslauf zur Stelle, Beschreibung und Schlüsselwörtern passt",
    atsScoreDesc: "Wie gut dein Lebenslauf für ATS-Systeme strukturiert und optimiert ist",
    loginTitle: "Willkommen zurück",
    loginSubtitle: "Melde dich an, um deine Analysen zu speichern",
    loginEmail: "E-Mail-Adresse",
    loginBtn: "Mit E-Mail fortfahren",
    loginGoogle: "Mit Google fortfahren",
    loginOr: "oder",
    loginSwitch: "Noch kein Konto?",
    loginSwitchLink: "Registrieren",
    signupSwitch: "Bereits ein Konto?",
    signupSwitchLink: "Anmelden",
    skipLogin: "Jetzt überspringen",
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
    errNotResume: "このドキュメントは履歴書ではないようです。経験、学歴、連絡先を含む有効な履歴書をアップロードしてください。",
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
    scanTitle: "履歴書をスキャン中...",
    scanSubtitle: "AIがドキュメントを分析しています",
    scanStep1: "ドキュメント構造の読み取り",
    scanStep2: "キーワードとスキルの抽出",
    scanStep3: "求人要件との照合",
    scanStep4: "スコアとインサイトの生成",
    resumeScoreDesc: "履歴書が職種・説明・キーワードとどれだけ一致しているか",
    atsScoreDesc: "履歴書がATSシステム向けにどれだけ構造化・最適化されているか",
    loginTitle: "おかえりなさい",
    loginSubtitle: "サインインして分析を保存しましょう",
    loginEmail: "メールアドレス",
    loginBtn: "メールで続ける",
    loginGoogle: "Googleで続ける",
    loginOr: "または",
    loginSwitch: "アカウントをお持ちでない方は",
    loginSwitchLink: "サインアップ",
    signupSwitch: "すでにアカウントをお持ちの方は",
    signupSwitchLink: "サインイン",
    skipLogin: "今はスキップ",
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
    errNotResume: "Este documento não parece ser um currículo. Por favor, carregue um currículo válido com seções de Experiência, Educação e dados de contato.",
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
    scanTitle: "Escaneando Currículo...",
    scanSubtitle: "A IA está analisando seu documento",
    scanStep1: "Lendo a estrutura do documento",
    scanStep2: "Extraindo palavras-chave e habilidades",
    scanStep3: "Comparando com os requisitos da vaga",
    scanStep4: "Gerando pontuações e insights",
    resumeScoreDesc: "Quão bem seu currículo corresponde ao cargo, descrição e palavras-chave",
    atsScoreDesc: "Quão bem seu currículo está estruturado e otimizado para sistemas ATS",
    loginTitle: "Bem-vindo de volta",
    loginSubtitle: "Entre para salvar suas análises",
    loginEmail: "Endereço de e-mail",
    loginBtn: "Continuar com e-mail",
    loginGoogle: "Continuar com Google",
    loginOr: "ou",
    loginSwitch: "Não tem uma conta?",
    loginSwitchLink: "Cadastre-se",
    signupSwitch: "Já tem uma conta?",
    signupSwitchLink: "Entre",
    skipLogin: "Pular por agora",
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
    errNotResume: "Dit document lijkt geen cv te zijn. Upload een geldig cv met secties als Ervaring, Opleiding en contactgegevens.",
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
    scanTitle: "CV wordt gescand...",
    scanSubtitle: "AI analyseert je document",
    scanStep1: "Documentstructuur lezen",
    scanStep2: "Trefwoorden en vaardigheden extraheren",
    scanStep3: "Vergelijken met functievereisten",
    scanStep4: "Scores en inzichten genereren",
    resumeScoreDesc: "Hoe goed je cv overeenkomt met de functie, beschrijving en trefwoorden",
    atsScoreDesc: "Hoe goed je cv gestructureerd en geoptimaliseerd is voor ATS-systemen",
    loginTitle: "Welkom terug",
    loginSubtitle: "Log in om je analyses op te slaan",
    loginEmail: "E-mailadres",
    loginBtn: "Doorgaan met e-mail",
    loginGoogle: "Doorgaan met Google",
    loginOr: "of",
    loginSwitch: "Nog geen account?",
    loginSwitchLink: "Aanmelden",
    signupSwitch: "Al een account?",
    signupSwitchLink: "Inloggen",
    skipLogin: "Nu overslaan",
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

  const colorMap = { teal: "#0d9488", amber: "#d97706" };
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
          <span style={{ fontSize:32, fontWeight:800, color:"#1c1917",
            fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>{displayed}</span>
          <span style={{ fontSize:11, color:"#78716c", marginTop:2 }}>/100</span>
        </div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#78716c",
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
        paddingBottom:8, borderBottom:"1px solid #e8ddd4" }}>
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
  const [result, setResult]             = useState(null);
  const [baseResult, setBaseResult]     = useState(null);
  const [translating, setTranslating]   = useState(false);
  const [error, setError]               = useState("");
  const [dragOver, setDragOver]         = useState(false);
  const [improving, setImproving]       = useState(false);
  const [improvedResume, setImprovedResume] = useState(null);
    const [user, setUser]                 = useState(null);
  const [authReady, setAuthReady]       = useState(false);
  const [skipLogin, setSkipLogin]       = useState(false);
  const [isSignup, setIsSignup]         = useState(false);
  const [loginEmail, setLoginEmail]     = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErr, setLoginErr]         = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const fileRef = useRef(null);

  const showLogin = authReady && !user && !skipLogin;

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? {
        name: u.displayName || u.email.split("@")[0],
        email: u.email,
        picture: u.photoURL || null,
      } : null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const handleGoogleSignIn = async () => {
    setLoginLoading(true); setLoginErr("");
    try {
      await signInWithPopup(auth, gProvider);
    } catch (e) {
      if (e.code === "auth/popup-closed-by-user") setLoginErr("Popup closed. Please try again.");
      else if (e.code === "auth/unauthorized-domain") setLoginErr("Add localhost to Firebase Authorized Domains (Auth → Settings).");
      else setLoginErr(e.message);
    } finally { setLoginLoading(false); }
  };

  const handleEmailAuth = async () => {
    if (!loginEmail.includes("@")) { setLoginErr("Enter a valid email."); return; }
    if (loginPassword.length < 6)  { setLoginErr("Password must be at least 6 characters."); return; }
    setLoginLoading(true); setLoginErr("");
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      else          await fbSignInEmail(auth, loginEmail, loginPassword);
    } catch (e) {
      const map = {
        "auth/user-not-found":      "No account found. Sign up instead?",
        "auth/wrong-password":      "Incorrect password.",
        "auth/invalid-credential":  "Incorrect email or password.",
        "auth/email-already-in-use":"Email already registered. Sign in instead.",
        "auth/weak-password":       "Password too weak. Use 6+ characters.",
      };
      setLoginErr(map[e.code] || e.message);
    } finally { setLoginLoading(false); }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setResult(null); setBaseResult(null); setFile(null);
    setJobTitle(""); setJobDesc(""); setImprovedResume(null);
  };
  // t is always in sync with lang — no custom dropdown state needed
  const t = TRANSLATIONS[lang];
  const currentLang = LANG_OPTIONS.find(l => l.code === lang);

  const handleLangChange = async (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    setError("");

    // If no result yet, just update the language — nothing to translate
    if (!baseResult) return;

    // Switching back to English → restore original result instantly, no API call
    if (newLang === "en") {
      setResult({ ...baseResult });
      return;
    }

    // For any other language → translate only the text fields
    // Scores are mathematically overwritten after — they NEVER change
    const lo = LANG_OPTIONS.find(l => l.code === newLang);
    const ln = lo?.label || "English";
    setTranslating(true);
    try {
      const translatePrompt = `You are a professional translator.
Translate ONLY the text fields of the following JSON into ${ln}.
Keep "resumeScore" and "atsScore" as EXACTLY the same integers — do not change them.
Translate ONLY: summary string, each string in strengths array, each title and description in improvements array.
Return ONLY valid JSON with identical structure. No markdown, no extra text.

${JSON.stringify(baseResult, null, 2)}`;

      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: translatePrompt }),
      });
      const data = await res.json();
      if (!data.error && data.text) {
        const translated = parseJSON(data.text);
        // Always force scores to match baseResult exactly
        translated.resumeScore = baseResult.resumeScore;
        translated.atsScore    = baseResult.atsScore;
        setResult(translated);
      }
    } catch (err) {
      console.error("Translation error:", err);
      // Silent fallback — keep showing current result
    } finally {
      setTranslating(false);
    }
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

  /*
   * ═══════════════════════════════════════════════════════════════════
   * extractText(f) — Custom PDF Binary Parser
   * Written from scratch. Zero external libraries used.
   * Works entirely in the browser — the file never leaves the device.
   * ═══════════════════════════════════════════════════════════════════
   *
   * HOW A PDF STORES TEXT (background):
   *   A PDF is not a simple text file. Text is stored as drawing
   *   instructions inside compressed content streams. Every piece of
   *   visible text sits between a BT (Begin Text) marker and an ET
   *   (End Text) marker. Inside those markers, text is drawn using
   *   operators like:
   *     Tj  — draw a single string, e.g.  (Hello World)Tj
   *     TJ  — draw an array of strings,   [(He)(llo)]TJ
   *
   *   This function reads those raw bytes, finds every BT...ET block,
   *   and decodes the text from each drawing instruction.
   *
   * STEP 1 — Image files:
   *   If the file is a PNG or JPG (not a PDF), we cannot extract text
   *   the same way. Instead we read it as a base64 string and pass it
   *   to the AI directly so the AI can read it visually.
   *
   * STEP 2 — Read the PDF as raw bytes:
   *   FileReader.readAsArrayBuffer() gives us the entire PDF file as
   *   a binary buffer. We wrap it in Uint8Array so we can loop through
   *   each byte numerically.
   *
   * STEP 3 — Convert bytes to a binary string:
   *   String.fromCharCode() turns each byte number into its character
   *   equivalent. We process in chunks of 8192 bytes at a time to avoid
   *   hitting JavaScript's maximum call stack size.
   *   Result: one long string containing the entire PDF binary content.
   *
   * STEP 4 — Find all BT...ET text blocks:
   *   The regex /BT([\s\S]*?)ET/g scans the binary string and captures
   *   everything between every BT and ET marker. Each captured group is
   *   one text block — it may contain many drawing instructions.
   *
   * STEP 5a — Decode Tj operator (single string):
   *   Pattern: (some text)Tj
   *   The regex /\(([^)]{1,300})\)\s*Tj/g captures the content inside
   *   the parentheses. We strip non-printable characters (anything
   *   outside ASCII 0x20–0x7E) and keep the readable text.
   *
   * STEP 5b — Decode TJ operator (array of strings with kerning):
   *   Pattern: [(part1)(part2) -200 (part3)]TJ
   *   Modern PDFs split one word into many small pieces for precise
   *   kerning (spacing) control. The outer regex captures the whole
   *   array. The inner regex /\(([^)]*)\)/g pulls out each piece.
   *   All pieces are joined together to reassemble the full word.
   *
   * STEP 5c — Hex-encoded strings:
   *   Some PDFs encode text as hex like <48656c6c6f> instead of (Hello).
   *   We decode these by reading 2 hex characters at a time, converting
   *   each pair to a number with parseInt(hex, 16), then to a character
   *   with String.fromCharCode(). Only printable ASCII is kept.
   *
   * STEP 6 — Deduplicate and clean:
   *   Spreading into a Set() removes any identical duplicate strings
   *   that can appear when PDF headers repeat content. Multiple spaces
   *   are collapsed. The result is one clean plain-text string.
   *
   * STEP 7 — Validate:
   *   If fewer than 30 characters were extracted (e.g. the PDF is a
   *   scanned image with no real text), we return the sentinel string
   *   "__EXTRACTION_FAILED__" so the analyze() function can show the
   *   user a helpful error message instead of sending garbage to the AI.
   * ═══════════════════════════════════════════════════════════════════
   */
  const extractText = (f) => {
    return new Promise((resolve) => {

      // ── STEP 1: Handle image files separately ──────────────────────
      // PNG/JPG files have no text operators — read as base64 so the
      // AI can interpret the image content directly.
      if (f.type.startsWith("image/")) {
        const imgReader = new FileReader();
        imgReader.onload  = (e) => resolve("IMAGE_FILE_BASE64:" + e.target.result.split(",")[1]);
        imgReader.onerror = ()  => resolve("__EXTRACTION_FAILED__");
        imgReader.readAsDataURL(f);
        return;
      }

      // ── STEP 2: Read the PDF file as raw binary ────────────────────
      // readAsArrayBuffer() gives us the full file as a byte buffer.
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          // ── STEP 3: Convert bytes → binary string ──────────────────
          // We process in chunks of 8192 bytes to stay within JS limits.
          const bytes  = new Uint8Array(e.target.result);
          let   binary = "";
          const CHUNK  = 8192;
          for (let i = 0; i < bytes.length; i += CHUNK) {
            binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
          }

          // ── Helper: decode a PDF hex string e.g. <48656c6c6f> ──────
          // Each pair of hex digits is one byte. We convert it to the
          // ASCII character it represents.
          const decodeHex = (hex) => {
            hex = hex.replace(/\s+/g, "");
            let out = "";
            for (let i = 0; i + 1 < hex.length; i += 2) {
              const code = parseInt(hex.slice(i, i + 2), 16);
              // Only keep printable ASCII characters
              if (code >= 32 && code <= 126) out += String.fromCharCode(code);
              else if (code === 32) out += " ";
            }
            return out;
          };

          // ── Helper: clean PDF literal string escape sequences ───────
          // Inside (literal strings), PDF uses backslash escapes:
          // \n = newline, \t = tab, \( = literal open paren, etc.
          const decodeLiteral = (s) => {
            let out = s
              .replace(/\\n/g, " ")
              .replace(/\\r/g, " ")
              .replace(/\\t/g, " ");
            // remove non-printable bytes
            out = out.replace(/[^\x20-\x7E]/g, " ");
            return out;
          };

          const blocks = [];

          // ── STEP 4: Find every BT...ET text block ──────────────────
          // BT = Begin Text, ET = End Text — these wrap all text drawing.
          // The [\s\S]*? makes the match non-greedy so we get each
          // individual block, not one giant match across the whole file.
          const btEtRe = /BT([\s\S]*?)ET/g;
          let   btMatch;

          while ((btMatch = btEtRe.exec(binary)) !== null) {
            const block = btMatch[1]; // content between BT and ET
            let m;

            // ── STEP 5a: Tj operator — single literal string ────────
            // Format: (text content)Tj
            const tjRe = /\(([^)]{1,300})\)\s*Tj/g;
            while ((m = tjRe.exec(block)) !== null) {
              const txt = decodeLiteral(m[1]).trim();
              if (txt.length > 1) blocks.push(txt);
            }

            // ── STEP 5b: TJ operator — array of strings (kerned) ───
            // Format: [(word)(part) -250 (more)]TJ
            // Modern PDFs split words for precise character spacing.
            // We pull out every (piece) and join them back into words.
            const tjArrRe = /\[([\s\S]*?)\]\s*TJ/g;
            while ((m = tjArrRe.exec(block)) !== null) {
              const inner  = m[1];
              const partRe = /\(([^)]*)\)/g;
              const parts  = [];
              let   p;
              while ((p = partRe.exec(inner)) !== null) {
                const txt = decodeLiteral(p[1]).trim();
                if (txt) parts.push(txt);
              }
              if (parts.length > 0) blocks.push(parts.join(""));
            }

            // ── STEP 5c: Hex-encoded Tj — <hex>Tj ──────────────────
            // Some PDFs use hex encoding instead of literal strings.
            // Format: <48656c6c6f>Tj  which means  (Hello)Tj
            const hexTjRe = /<([0-9a-fA-F\s]+)>\s*Tj/g;
            while ((m = hexTjRe.exec(block)) !== null) {
              const txt = decodeHex(m[1]).trim();
              if (txt.length > 1) blocks.push(txt);
            }

            // ── STEP 5d: Hex-encoded TJ array — [<hex>...]TJ ───────
            // Same as 5b but each element is hex-encoded.
            const hexArrRe = /\[([^\]]*<[0-9a-fA-F\s]+>[^\]]*)\]\s*TJ/g;
            while ((m = hexArrRe.exec(block)) !== null) {
              const inner  = m[1];
              const hexRe  = /<([0-9a-fA-F\s]+)>/g;
              const parts  = [];
              let   hp;
              while ((hp = hexRe.exec(inner)) !== null) {
                const txt = decodeHex(hp[1]).trim();
                if (txt) parts.push(txt);
              }
              if (parts.length > 0) blocks.push(parts.join(""));
            }

            // ── STEP 5e: Quote operator ' — next line + show ───────
            // The apostrophe operator means "move to next line and draw".
            // Format: (text)'
            const quoteRe = /\(([^)]*)\)\s*'/g;
            while ((m = quoteRe.exec(block)) !== null) {
              const txt = decodeLiteral(m[1]).trim();
              if (txt.length > 1) blocks.push(txt);
            }
          }

          // ── Global pass: scan outside BT/ET for missed Tj ──────────
          // Always run this — catches text outside BT/ET blocks.
          {
            const globalTjRe = /\(([^)]{2,300})\)\s*Tj/g;
            let gm;
            while ((gm = globalTjRe.exec(binary)) !== null) {
              const txt = decodeLiteral(gm[1]).trim();
              if (txt.length > 2) blocks.push(txt);
            }
          }

          // ── Last resort: extract readable word sequences ──────────
          // If BT/ET parsing found very little, scan for readable text.
          // We skip known PDF metadata keywords to avoid sending junk.
          if (blocks.length < 8) {
            const pdfNoise = new Set([
              "obj","endobj","stream","endstream","xref","trailer","startxref",
              "Type","Page","Font","Resources","MediaBox","Contents","Parent",
              "Kids","Count","Catalog","Pages","CreationDate","ModDate",
              "Producer","Creator","Author","Subject","Keywords","Title",
              "Linearized","Version","Length","Filter","FlateDecode","Width",
              "Height","ColorSpace","BitsPerComponent","Subtype","Image",
              "DeviceRGB","DeviceGray","ProcSet","PDF","Text"
            ]);
            const wordRe = /[A-Za-z][A-Za-z0-9 ,.'@+\-]{3,}/g;
            let wm;
            while ((wm = wordRe.exec(binary)) !== null) {
              const w = wm[0].replace(/\s+/g, " ").trim();
              // Only keep if not a PDF keyword and looks like real content
              if (w.length >= 4 && !pdfNoise.has(w.split(" ")[0])) {
                blocks.push(w);
              }
            }
          }

          // ── STEP 6: Deduplicate and clean ──────────────────────────
          // Set() removes identical duplicate strings (PDF headers often
          // repeat content). We filter out very short noise tokens, then
          // join everything with spaces and collapse multiple whitespace.
          const seen    = new Set();
          const cleaned = blocks
            .map(b => b.replace(/\s+/g, " ").trim())
            .filter(b => {
              if (b.length < 2) return false;  // skip single chars
              if (seen.has(b))  return false;  // skip duplicates
              seen.add(b);
              return true;
            });

          const fullText = cleaned.join(" ").replace(/\s{3,}/g, "  ").trim();

          console.log(
            "Custom parser extracted:", fullText.length, "chars",
            "| Blocks found:", blocks.length,
            "| Preview:", fullText.slice(0, 120)
          );

          // ── STEP 7: Validate and return ────────────────────────────
          // If we got fewer than 30 characters, the PDF is likely a
          // scanned image (no real text). Return the sentinel so
          // analyze() can show the user a helpful error instead of
          // sending meaningless content to the AI.
          if (fullText.length >= 30) {
            resolve(fullText);
          } else {
            resolve("__EXTRACTION_FAILED__");
          }

        } catch (err) {
          console.error("Custom PDF parser error:", err);
          resolve("__EXTRACTION_FAILED__");
        }
      };

      reader.onerror = () => resolve("__EXTRACTION_FAILED__");

      // ── STEP 2 (cont): Start the binary read ───────────────────────
      // This triggers reader.onload above once the file is fully read.
      reader.readAsArrayBuffer(f);
    });
  };

  /* ── Robust JSON parser — handles extra text, truncation, bad chars ── */
  const parseJSON = (raw) => {
    let s = raw
      .replace(/```json/g, "").replace(/```/g, "").trim();
    const first = s.indexOf("{");
    const last  = s.lastIndexOf("}");
    if (first === -1 || last === -1 || last < first)
      throw new Error("No JSON in response");
    s = s.slice(first, last + 1);
    try { return JSON.parse(s); } catch (_) {}
    // Remove trailing commas
    s = s.replace(/,(\s*[}\]])/g, "$1");
    // Close unclosed brackets
    const stack = [];
    let inStr = false, esc = false;
    for (const ch of s) {
      if (esc)          { esc = false; continue; }
      if (ch === "\\" && inStr) { esc = true; continue; }
      if (ch === '"')   { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{" || ch === "[") stack.push(ch === "{" ? "}" : "]");
      if (ch === "}" || ch === "]") stack.pop();
    }
    s = s + stack.reverse().join("");
    return JSON.parse(s);
  };


  /* ── Analysis ── */
  const analyze = async () => {
    setError("");
    if (!file)            { setError(t.errFile);  return; }
    if (!jobTitle.trim()) { setError(t.errTitle); return; }

    setLoading(true);
    setScanning(true);
    setScanStep(0);

    const timers = [0, 600, 1200, 1800].map((delay, i) =>
      setTimeout(() => setScanStep(i + 1), delay)
    );

    try {
      const resumeText = await extractText(file);
      if (resumeText === "__EXTRACTION_FAILED__") {
        setError("Could not read text from this file. Make sure it is a text-based PDF, not a scanned image.");
        return;
      }

      // ── ALWAYS analyze in English — ensures consistent scores every time ──
      // Language is applied AFTER via translation, not during scoring.
      const prompt = `You are a professional resume coach and career consultant. Read the resume below carefully and give an honest, helpful analysis.

--- RESUME START ---
${resumeText}
--- RESUME END ---

Target Job Title: ${jobTitle}
${jobDesc ? `Job Description:\n${jobDesc}` : ""}

STRICT RULES:
1. Write 100% in ENGLISH.
2. This is a real person's resume. Treat it seriously.
3. Find and reference the person's ACTUAL name, companies, skills, technologies, and projects from the text.
4. ALWAYS return exactly 3 strengths — real specific things this person has done or knows.
5. ALWAYS return exactly 4 improvements — specific actionable advice for this exact resume.
6. Do NOT say "this is not a resume" unless the document is completely unreadable gibberish.

SCORING RULES:
- resumeScore = how well THIS resume matches the job title/description (keyword match, relevant skills, experience fit)
  - Strong match with good keywords and relevant experience: 70-90
  - Decent match but missing some keywords: 55-70
  - Weak match or little relevant experience: 40-55
  - Two different resumes for same job MUST get different scores if content differs
- atsScore = how well structured the resume is for ATS systems
  - Clear sections (Experience, Education, Skills), bullet points, action verbs: 65-85
  - Some structure but missing sections or weak formatting: 50-65
  - Poor structure, no clear sections: 35-50
- Minimum score for any real resume with readable content is 45.

Respond ONLY with valid JSON — no markdown fences, no text before or after:
{
  "resumeScore": <integer 45-100>,
  "atsScore": <integer 45-100>,
  "summary": "<2-3 sentences mentioning the person by name and referencing their actual skills, companies, or projects>",
  "strengths": [
    "<strength 1 — specific real thing from this resume>",
    "<strength 2 — specific real thing from this resume>",
    "<strength 3 — specific real thing from this resume>"
  ],
  "improvements": [
    { "title": "<issue title>", "description": "<specific actionable fix for THIS resume>" },
    { "title": "<issue title>", "description": "<specific actionable fix for THIS resume>" },
    { "title": "<issue title>", "description": "<specific actionable fix for THIS resume>" },
    { "title": "<issue title>", "description": "<specific actionable fix for THIS resume>" }
  ]
}`;

      const [res] = await Promise.all([
        fetch("http://localhost:3001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
        new Promise(r => setTimeout(r, 2500)),
      ]);

      const data = await res.json();
      if (data.error) { setError("API Error: " + data.error); return; }

      const english = parseJSON(data.text || "");

      // Enforce minimum scores — never show below 45 for a real resume
      if (english.resumeScore < 45) english.resumeScore = 45;
      if (english.atsScore < 45)    english.atsScore    = 45;

      // Ensure strengths array always has 3 items
      if (!Array.isArray(english.strengths) || english.strengths.length === 0) {
        english.strengths = [
          "Resume submitted for analysis",
          "Document uploaded successfully",
          "Ready for improvement"
        ];
      }
      while (english.strengths.length < 3) {
        english.strengths.push("See improvements section for detailed feedback");
      }

      // Ensure improvements array always has 4 items
      if (!Array.isArray(english.improvements) || english.improvements.length === 0) {
        english.improvements = [
          { title: "Add more detail", description: "Expand your experience section with specific achievements." },
          { title: "Include keywords", description: "Add keywords from the job description throughout your resume." },
          { title: "Quantify results", description: "Add numbers and metrics to your bullet points." },
          { title: "Improve formatting", description: "Use clear section headers and consistent bullet points." }
        ];
      }
      while (english.improvements.length < 4) {
        english.improvements.push({ title: "Additional tip", description: "Review and refine this section for better impact." });
      }

      // Store the English base result — this never changes for this resume
      setBaseResult(english);

      setScanStep(5);
      await new Promise(r => setTimeout(r, 600));
      setScanning(false);

      // If user is on English, show directly
      if (lang === "en") {
        setResult(english);
        return;
      }

      // Otherwise translate into selected language immediately
      const lo = LANG_OPTIONS.find(l => l.code === lang);
      const ln = lo?.label || "English";
      setTranslating(true);
      try {
        const translatePrompt = `You are a professional translator.
Translate ONLY the text fields of the following JSON into ${ln}.
Keep "resumeScore" and "atsScore" as EXACTLY the same integers — do not touch them.
Translate ONLY: summary string, each string in strengths array, each title and description in improvements array.
Return ONLY valid JSON with identical structure. No markdown, no extra text.

${JSON.stringify(english, null, 2)}`;

        const tRes = await fetch("http://localhost:3001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: translatePrompt }),
        });
        const tData = await tRes.json();
        if (!tData.error && tData.text) {
          const translated = parseJSON(tData.text);
          translated.resumeScore = english.resumeScore;
          translated.atsScore    = english.atsScore;
          setResult(translated);
        } else {
          setResult(english);
        }
      } catch {
        setResult(english);
      } finally {
        setTranslating(false);
      }

    } catch (err) {
      console.error("Analyze error:", err);
      setScanning(false);
      setError(t.errFailed + " (" + (err.message || "unknown error") + ")");
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null); setBaseResult(null); setFile(null);
    setJobTitle(""); setJobDesc(""); setError("");
    setImprovedResume(null); setTranslating(false);
  };

  /* ── Improve Resume ── */
  const improveResume = async () => {
    setImproving(true);
    setImprovedResume(null);
    try {
      const resumeText = await extractText(file);
      const langOption = LANG_OPTIONS.find(l => l.code === lang);
      const langName   = langOption?.label || "English";
      const prompt = `You are an expert resume writer. Rewrite and significantly improve the following resume for the target job role.

--- ORIGINAL RESUME ---
${resumeText}
--- END RESUME ---

Target Job Title: ${jobTitle}
${jobDesc ? `Job Description:\n${jobDesc}` : ""}

LANGUAGE RULE: Write all text values in ${langName}. Keep name, contact info, and dates in their original form.

Rewrite this resume to be highly tailored, professional, and ATS-optimized for the target role.
Improve bullet points with strong action verbs and quantifiable achievements where possible.
Keep all real information — do not fabricate facts, companies, or dates.

Respond ONLY with a valid JSON object in this exact structure, no markdown fences:
{
  "name": "<full name from resume — keep original>",
  "contact": "<email | phone | location | linkedin — keep original>",
  "summary": "<3-4 sentence professional summary in ${langName}>",
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name — keep original>",
      "duration": "<start – end — keep original>",
      "bullets": ["<bullet 1 in ${langName}>", "<bullet 2 in ${langName}>", "<bullet 3 in ${langName}>"]
    }
  ],
  "education": [
    {
      "degree": "<degree and field in ${langName}>",
      "school": "<institution name — keep original>",
      "year": "<graduation year or expected — keep original>"
    }
  ],
  "skills": "<comma-separated list of relevant skills>",
  "projects": [
    {
      "name": "<project name — keep original>",
      "description": "<1-2 sentence description in ${langName}>"
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
      setImprovedResume(parseJSON(data.text || ""));
    } catch (err) {
      console.error(err);
      setError("Failed to improve resume. Please try again.");
    } finally {
      setImproving(false);
    }
  };

  /* ── Download as HTML/PDF  ── */
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
    body { background: #faf5ef; font-family: 'Manrope', sans-serif; color: #292524; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: rgba(13,148,136,0.3); border-radius: 3px; }
    input, textarea, select { font-family: 'Manrope', sans-serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fu  { animation: fadeUp 0.5s ease forwards; opacity: 0; }
    .d1  { animation-delay: 0.07s; }
    .d2  { animation-delay: 0.14s; }
    .d3  { animation-delay: 0.22s; }
    .d4  { animation-delay: 0.30s; }
    .card {
      background: #ffffff;
      border: 1px solid #e8ddd4;
      border-radius: 20px;
      box-shadow: 0 2px 16px rgba(180,120,60,0.07);
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
      color: #a8937e;
      font-size: 11px;
      pointer-events: none;
      z-index: 2;
    }
    .lang-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: #fff8f2;
      border: 1px solid #e8ddd4;
      border-radius: 12px;
      color: #292524;
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
    .lang-select:hover  { background: #fff3e8; border-color: rgba(13,148,136,0.4); }
    .lang-select:focus  { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }
    .lang-select option { background: #fff8f2; color: #292524; padding: 8px; }
    .upload-zone {
      border: 2px dashed rgba(13,148,136,0.3);
      border-radius: 18px;
      padding: 46px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      text-align: center;
      transition: all 0.22s;
      background: rgba(13,148,136,0.04);
    }
    .upload-zone:hover, .drag-over {
      border-color: rgba(13,148,136,0.6) !important;
      background: rgba(13,148,136,0.05) !important;
      box-shadow: 0 0 28px rgba(13,148,136,0.08);
    }
    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #a8937e;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .inp {
      width: 100%;
      background: #fff8f2;
      border: 1px solid #e8ddd4;
      border-radius: 14px;
      color: #292524;
      font-size: 15px;
      padding: 14px 18px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .inp::placeholder { color: #c4a98a; }
    .inp:focus { border-color: rgba(13,148,136,0.5); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
    .btn-main {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #0d9488, #0369a1);
      border: none;
      border-radius: 14px;
      color: #ffffff;
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
    .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(13,148,136,0.25); }
    .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-reset {
      background: #fff8f2;
      border: 1px solid #e8ddd4;
      border-radius: 12px;
      color: #57534e;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-reset:hover { background: #f0e8de; }
    .strength-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: rgba(13,148,136,0.06);
      border: 1px solid rgba(13,148,136,0.2);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 13px;
      color: #0f5450;
      line-height: 1.55;
    }
    .improve-item {
      display: flex;
      gap: 14px;
      background: rgba(217,119,6,0.05);
      border: 1px solid rgba(217,119,6,0.18);
      border-radius: 14px;
      padding: 18px;
    }
    .improve-num {
      min-width: 28px;
      height: 28px;
      background: rgba(217,119,6,0.12);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: #b45309;
      flex-shrink: 0;
    }
    .err-box {
      background: rgba(220,38,38,0.06);
      border: 1px solid rgba(220,38,38,0.2);
      border-radius: 12px;
      padding: 13px 18px;
      font-size: 13px;
      color: #b91c1c;
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
        <div className="blob" style={{ width:550, height:550, top:"-180px", left:"-150px", background:"#f97316", opacity:0.06 }} />
        <div className="blob" style={{ width:400, height:400, bottom:"80px", right:"-100px", background:"#0d9488", opacity:0.06 }} />

        {/* Full page resume background — only on upload screen */}
        {!result && !scanning && (
          <>
            {/* ── Sarah Johnson — top-left, large, slight inward ── */}
            <div style={{ position:"fixed", top:"3vh", left:"3vw", width:290, opacity:0.11,
              transform:"rotate(-6deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Sarah Johnson</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>sarah.j@email.com  •  New York, NY  •  linkedin.com/in/sarahj</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Senior Product Manager — Google</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Led 3 major product launches across 5 cross-functional teams</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Increased user retention by 34% through data-driven redesign</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Product Manager — Airbnb  (2019–2022)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Managed host onboarding roadmap affecting 2M+ users globally</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>MBA — Stanford Graduate School of Business  •  2019</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>Product Strategy  •  Roadmapping  •  SQL  •  Figma  •  OKRs  •  Agile</div>
            </div>

            {/* ── Raj Patel — top-right, large ── */}
            <div style={{ position:"fixed", top:"3vh", right:"3vw", width:290, opacity:0.11,
              transform:"rotate(5deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Raj Patel</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>raj.patel@dev.io  •  San Francisco, CA  •  github.com/rajpatel</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Full Stack Engineer — Stripe  (2022–Present)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Built payment APIs processing $2B+ in annual transactions</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Reduced API latency by 40% with Redis caching strategy</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Backend Engineer — Dropbox  (2020–2022)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Built microservices in Go serving 500M+ users worldwide</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>B.S. Computer Science — MIT  •  2020  •  GPA 3.9/4.0</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>React  •  Node.js  •  Go  •  PostgreSQL  •  AWS  •  Docker  •  Kubernetes</div>
            </div>

            {/* ── Emma Williams — center-left, overlaps center ── */}
            <div style={{ position:"fixed", top:"35vh", left:"5vw", width:280, opacity:0.1,
              transform:"rotate(-4deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Emma Williams</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>emma.w@design.co  •  London, UK  •  emmawilliams.design</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Lead UX Designer — Spotify  (2021–Present)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Redesigned onboarding flow, boosting conversion by 28%</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Led design system adopted by 60+ engineers worldwide</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>UX Designer — Apple  (2018–2021)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Shipped 4 major iOS features reaching 1B+ users globally</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>BFA Interaction Design — Parsons School of Design  •  2018</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>Figma  •  Sketch  •  Prototyping  •  User Research  •  HTML  •  CSS</div>
            </div>

            {/* ── Yuki Tanaka — center-right, overlaps center ── */}
            <div style={{ position:"fixed", top:"35vh", right:"5vw", width:280, opacity:0.1,
              transform:"rotate(4deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Yuki Tanaka</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>yuki.t@ml.jp  •  Tokyo, Japan  •  researchgate.net/yuki</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>ML Research Scientist — OpenAI  (2022–Present)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Co-authored 3 papers on transformer architecture optimization</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Improved training efficiency by 22% using novel scheduling</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>AI Engineer — Sony Research  (2020–2022)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Built real-time CV models deployed on edge devices at scale</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>Ph.D. Machine Learning — University of Tokyo  •  2020</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>Python  •  PyTorch  •  TensorFlow  •  CUDA  •  C++  •  JAX  •  R</div>
            </div>

            {/* ── Marcus Chen — bottom-left, large ── */}
            <div style={{ position:"fixed", bottom:"2vh", left:"3vw", width:285, opacity:0.1,
              transform:"rotate(-5deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Marcus Chen</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>marcus@finance.com  •  Chicago, IL  •  CFA Charterholder</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Investment Analyst — Goldman Sachs  (2021–Present)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Managed $500M equity portfolio achieving 18% annual return</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Built DCF models supporting 30+ M&A transactions globally</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Financial Analyst — JPMorgan Chase  (2019–2021)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Conducted due diligence on $2B+ deals in the tech sector</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>B.S. Finance — Wharton School, University of Pennsylvania  •  2019</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>Excel  •  Bloomberg Terminal  •  Python  •  SQL  •  Financial Modeling</div>
            </div>

            {/* ── Priya Sharma — bottom-right, large ── */}
            <div style={{ position:"fixed", bottom:"2vh", right:"3vw", width:285, opacity:0.1,
              transform:"rotate(5deg)", fontFamily:"'Manrope',sans-serif", background:"#fff",
              border:"1px solid #c4b5a5", borderRadius:8, padding:"18px 20px", fontSize:9,
              lineHeight:1.8, color:"#1c1917", boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
              pointerEvents:"none", zIndex:0 }}>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>Priya Sharma</div>
              <div style={{ fontSize:8, marginBottom:10, color:"#78716c" }}>priya.s@data.in  •  Bangalore, India  •  linkedin.com/in/priyasharma</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EXPERIENCE</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Data Scientist — Flipkart  (2022–Present)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:1 }}>• Built recommendation engine increasing GMV by 15%</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:7 }}>• Processed 10M+ daily events using Apache Spark pipelines</div>
              <div style={{ fontWeight:600, marginBottom:2, fontSize:9 }}>Data Analyst — Tata Consultancy Services  (2020–2022)</div>
              <div style={{ fontSize:8, color:"#57534e", marginBottom:9 }}>• Delivered BI dashboards for 5 Fortune 500 clients worldwide</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>EDUCATION</div>
              <div style={{ fontSize:8, marginBottom:9 }}>M.Tech Data Science — IIT Bombay  •  2020  •  Gold Medallist</div>
              <div style={{ fontWeight:700, fontSize:9, borderBottom:"1px solid #e8ddd4", marginBottom:5, paddingBottom:2, letterSpacing:"0.05em" }}>SKILLS</div>
              <div style={{ fontSize:8, color:"#57534e" }}>Python  •  Apache Spark  •  Tableau  •  TensorFlow  •  SQL  •  AWS</div>
            </div>
          </>
        )}
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:760, margin:"0 auto", padding:"28px 18px 72px" }}>

        {/* ══════════════ LANGUAGE SELECTOR ══════════════ */}
        <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {user.picture
                ? <img src={user.picture} style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #e8ddd4" }} alt="avatar"/>
                : <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#0d9488,#0369a1)",
                    display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
                    fontSize:14, fontWeight:700 }}>{user.name[0].toUpperCase()}</div>
              }
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{user.name}</div>
                <div style={{ fontSize:11, color:"#a8937e" }}>{user.email}</div>
              </div>
            </div>
          ) : <div/>}
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

        {showLogin ? (
          /* ══════════════ LOGIN SCREEN ══════════════ */
          <div className="card fu" style={{ padding:"48px 40px", textAlign:"center", maxWidth:440, margin:"0 auto" }}>

            <div style={{ width:54, height:54, background:"linear-gradient(135deg,#0d9488,#0369a1)",
              borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:24, margin:"0 auto 22px" }}>✦</div>

            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:22,
              color:"#1c1917", marginBottom:6 }}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={{ fontSize:13, color:"#78716c", marginBottom:26, lineHeight:1.6 }}>
              {isSignup ? "Sign up to save your analyses" : "Sign in to track your progress"}
            </p>

            {loginErr && (
              <div style={{ background:"rgba(220,38,38,0.06)", border:"1px solid rgba(220,38,38,0.2)",
                borderRadius:10, padding:"10px 14px", fontSize:13, color:"#b91c1c",
                marginBottom:14, textAlign:"left" }}>⚠ {loginErr}</div>
            )}

            <button onClick={handleGoogleSignIn} disabled={loginLoading}
              style={{ width:"100%", padding:"12px 20px", borderRadius:12, marginBottom:12,
                background:"#fff8f2", border:"1px solid #e8ddd4", color:"#292524",
                fontSize:14, fontWeight:600, cursor: loginLoading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                fontFamily:"'Manrope',sans-serif", transition:"background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="#f0e8de"}
              onMouseLeave={e => e.currentTarget.style.background="#fff8f2"}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:"#e8ddd4" }}/>
              <span style={{ fontSize:12, color:"#a8937e" }}>or</span>
              <div style={{ flex:1, height:1, background:"#e8ddd4" }}/>
            </div>

            <input className="inp" type="email" placeholder="Email address"
              value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
              style={{ marginBottom:10 }} />

            <input className="inp" type="password"
              placeholder={isSignup ? "Create password (min 6 chars)" : "Password"}
              value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
              style={{ marginBottom:12 }} />

            <button className="btn-main" onClick={handleEmailAuth} disabled={loginLoading}
              style={{ width:"100%", marginBottom:18 }}>
              {loginLoading
                ? <><span style={{ display:"inline-block", width:15, height:15,
                    border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff",
                    borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>{" "}
                    {isSignup ? "Creating account..." : "Signing in..."}</>
                : isSignup ? "Create Account" : "Sign In"
              }
            </button>

            <div style={{ fontSize:13, color:"#78716c", marginBottom:12 }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span onClick={() => { setIsSignup(!isSignup); setLoginErr(""); }}
                style={{ color:"#0d9488", cursor:"pointer", fontWeight:600 }}>
                {isSignup ? "Sign in" : "Sign up"}
              </span>
            </div>

            <button onClick={() => setSkipLogin(true)}
              style={{ background:"none", border:"none", color:"#c4a98a", fontSize:12,
                cursor:"pointer", fontFamily:"'Manrope',sans-serif", textDecoration:"underline" }}>
              Skip for now
            </button>
          </div>

        ) : scanning ? (
          /* ══════════════ SCANNING SCREEN ══════════════ */
          <div className="card fu" style={{ padding:"60px 40px", textAlign:"center", marginBottom:18, background:"#ffffff" }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ position:"relative", width:100, height:100, margin:"0 auto 28px" }}>
                <svg viewBox="0 0 100 100" style={{ width:100, height:100, transform:"rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(13,148,136,0.12)" strokeWidth="6"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#0d9488" strokeWidth="6"
                    strokeDasharray="264" strokeDashoffset={264 - (264 * Math.min(scanStep, 4) / 4)}
                    style={{ transition:"stroke-dashoffset 0.8s ease" }}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22, fontWeight:800, color:"#0d9488",
                  fontFamily:"'Outfit',sans-serif" }}>
                  {Math.round(Math.min(scanStep, 4) / 4 * 100)}%
                </div>
              </div>

              <div style={{ fontSize:20, fontWeight:700, color:"#1c1917",
                fontFamily:"'Outfit',sans-serif", marginBottom:8 }}>
                {t.scanTitle}
              </div>
              <div style={{ fontSize:13, color:"#78716c", marginBottom:36 }}>
                {t.scanSubtitle}
              </div>

              {[
                { label: t.scanStep1, icon: "📄" },
                { label: t.scanStep2, icon: "🔍" },
                { label: t.scanStep3, icon: "🎯" },
                { label: t.scanStep4, icon: "📊" },
              ].map((step, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:14,
                  padding:"12px 20px", borderRadius:12, marginBottom:10,
                  background: scanStep > i ? "rgba(13,148,136,0.06)" : "#faf5ef",
                  border: scanStep > i ? "1px solid rgba(13,148,136,0.2)" : "1px solid #e8ddd4",
                  transition:"all 0.4s ease",
                  opacity: scanStep > i ? 1 : 0.35,
                }}>
                  <span style={{ fontSize:18 }}>{step.icon}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: scanStep > i ? "#0d9488" : "#a8937e",
                    transition:"color 0.4s ease", flex:1, textAlign:"left" }}>
                    {step.label}
                  </span>
                  {scanStep > i && (
                    <span style={{ fontSize:16, color:"#0d9488" }}>✓</span>
                  )}
                  {scanStep === i + 1 && (
                    <span style={{ display:"inline-block", width:14, height:14,
                      border:"2px solid rgba(13,148,136,0.3)", borderTopColor:"#0d9488",
                      borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

        ) : !result ? (
          <>
            {/* ══════════════ HERO ══════════════ */}
            <div className="fu d1" style={{ textAlign:"center", marginBottom:44, position:"relative" }}>


              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(13,148,136,0.1)", border:"1px solid rgba(13,148,136,0.2)",
                borderRadius:999, padding:"6px 16px", fontSize:11, fontWeight:700,
                letterSpacing:"0.1em", color:"#0d9488", marginBottom:22, textTransform:"uppercase"
              }}>
                <span>✦</span><span>{t.badge}</span>
              </div>

              <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, lineHeight:1.1, marginBottom:18 }}>
                <span style={{ fontSize:"clamp(40px,7vw,66px)", color:"#1c1917", display:"block" }}>
                  {t.title1}
                </span>
                <span style={{
                  fontSize:"clamp(40px,7vw,66px)", display:"block",
                  background:"linear-gradient(135deg,#0d9488,#0369a1)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
                }}>
                  {t.title2}
                </span>
              </h1>

              <p style={{ fontSize:16, color:"#78716c", maxWidth:500,
                margin:"0 auto", lineHeight:1.75, color:"#78716c" }}>{t.subtitle}</p>
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
                        <div style={{ fontWeight:700, color:"#0d9488", fontSize:15 }}>{file.name}</div>
                        <div style={{ fontSize:12, color:"#a8937e", marginTop:4 }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setFile(null); }}
                        style={{ background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)",
                          borderRadius:8, color:"#b91c1c", padding:"6px 14px", cursor:"pointer",
                          fontSize:12, fontWeight:600, fontFamily:"'Manrope',sans-serif" }}>
                        {t.removeFile}
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ width:60, height:60, background:"rgba(13,148,136,0.1)",
                        borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="#0d9488"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 16.5V18.75C3 19.993 4.007 21 5.25 21H18.75C19.993 21 21 19.993 21 18.75V16.5"
                            stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontWeight:700, color:"#1c1917", fontSize:15 }}>
                          {t.dropText}{" "}
                        </span>
                        <span style={{ color:"#0d9488", fontWeight:800, fontSize:15,
                          borderBottom:"1px solid rgba(13,148,136,0.5)" }}>{t.browse}</span>
                      </div>
                      <div style={{ fontSize:12, color:"#78716c", fontWeight:600 }}>{t.fileHint}</div>
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
                  <span style={{ color:"#a8937e", fontSize:11, fontWeight:500,
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

              <p style={{ textAlign:"center", fontSize:11, color:"#c4a98a",
                marginTop:14, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>🔒</span>{t.privacy}
              </p>
            </div>
          </>

        ) : (

          /* ══════════════ RESULTS ══════════════ */
          <div>
            {translating && (
              <div className="fu" style={{ display:"flex", alignItems:"center", gap:10,
                padding:"11px 18px", background:"rgba(13,148,136,0.07)",
                border:"1px solid rgba(13,148,136,0.2)", borderRadius:12, marginBottom:14,
                fontSize:13, color:"#0d9488", fontWeight:600 }}>
                <span style={{ display:"inline-block", width:14, height:14,
                  border:"2px solid rgba(13,148,136,0.3)", borderTopColor:"#0d9488",
                  borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                Translating results...
              </div>
            )}

            <div className="card fu" style={{ padding:40, marginBottom:18, textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#0d9488",
                letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                ✦ {t.resultHeading}
              </div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
                fontSize:26, color:"#1c1917", marginBottom:34 }}>{t.resultSubheading}</h2>

              <div style={{ display:"flex", justifyContent:"center", gap:56, flexWrap:"wrap" }}>
                <ScoreRing score={result.resumeScore} label={t.resumeScore} color="teal" delay={200} />
                <ScoreRing score={result.atsScore}    label={t.atsScore}    color="amber" delay={500} />
              </div>

              <div style={{ display:"flex", justifyContent:"center", gap:24,
                marginTop:26, flexWrap:"wrap" }}>
                {[["#00d4aa", `${t.resumeScore}: ${result.resumeScore}/100`],
                  ["#f59e0b", `${t.atsScore}: ${result.atsScore}/100`]].map(([c, l], i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7,
                    fontSize:13, color:"#78716c" }}>
                    <span style={{ width:9, height:9, borderRadius:"50%",
                      background:c, display:"inline-block" }} />{l}
                  </div>
                ))}
              </div>

              {/* Score descriptions */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:28 }}>
                <div style={{ background:"rgba(13,148,136,0.05)", border:"1px solid rgba(13,148,136,0.15)",
                  borderRadius:12, padding:"14px 16px", textAlign:"left" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#0d9488", letterSpacing:"0.08em",
                    textTransform:"uppercase", marginBottom:6 }}>📋 {t.resumeScore}</div>
                  <div style={{ fontSize:12, color:"#44403c", fontWeight:500, lineHeight:1.6 }}>
                    {t.resumeScoreDesc}
                  </div>
                </div>
                <div style={{ background:"rgba(217,119,6,0.05)", border:"1px solid rgba(217,119,6,0.15)",
                  borderRadius:12, padding:"14px 16px", textAlign:"left" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#b45309", letterSpacing:"0.08em",
                    textTransform:"uppercase", marginBottom:6 }}>🤖 {t.atsScore}</div>
                  <div style={{ fontSize:12, color:"#44403c", fontWeight:500, lineHeight:1.6 }}>
                    {t.atsScoreDesc}
                  </div>
                </div>
              </div>
            </div>

            <div className="card fu d1" style={{ padding:26, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>📋</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#1c1917" }}>{t.summaryTitle}</h3>
              </div>
              <p style={{ color:"#57534e", lineHeight:1.8, fontSize:14 }}>
                {result.summary}
              </p>
            </div>

            <div className="card fu d2" style={{ padding:26, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:18 }}>🌟</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#1c1917" }}>{t.strengthsTitle}</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(result.strengths || []).map((s, i) => (
                  <div key={i} className="strength-item">
                    <span style={{ color:"#0d9488", fontWeight:800, minWidth:20 }}>{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card fu d3" style={{ padding:26, marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:18 }}>🔧</span>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700,
                  fontSize:16, color:"#1c1917" }}>{t.improvementsTitle}</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {(result.improvements || []).map((item, i) => (
                  <div key={i} className="improve-item">
                    <div className="improve-num">{i + 1}</div>
                    <div>
                      <div style={{ fontWeight:700, color:"#1c1917", fontSize:14, marginBottom:6 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize:13, color:"#78716c", lineHeight:1.7 }}>
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
                    <div style={{ fontSize:11, fontWeight:700, color:"#0d9488",
                      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                      ✦ {t.improvedTitle}
                    </div>
                    <div style={{ fontSize:13, color:"#78716c" }}>{t.improvedSubtitle}</div>
                  </div>
                  <button className="btn-main" onClick={downloadResume}
                    style={{ width:"auto", padding:"12px 22px", fontSize:13 }}>
                    {t.downloadBtn}
                  </button>
                </div>

                {/* Name & Contact */}
                <div style={{ borderBottom:"1px solid #e8ddd4", paddingBottom:18, marginBottom:20 }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:"#1c1917" }}>
                    {improvedResume.name}
                  </div>
                  <div style={{ fontSize:13, color:"#0d9488", marginTop:4 }}>{improvedResume.contact}</div>
                </div>

                {/* Summary */}
                <ResumeSection title="Professional Summary" icon="📋">
                  <p style={{ color:"#44403c", lineHeight:1.8, fontSize:14 }}>{improvedResume.summary}</p>
                </ResumeSection>

                {/* Experience */}
                {improvedResume.experience?.length > 0 && (
                  <ResumeSection title="Experience" icon="💼">
                    {improvedResume.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom:16 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
                          <div>
                            <span style={{ fontWeight:700, color:"#1c1917", fontSize:14 }}>{exp.title}</span>
                            <span style={{ color:"#0d9488", fontSize:13 }}> — {exp.company}</span>
                          </div>
                          <span style={{ fontSize:12, color:"#78716c" }}>{exp.duration}</span>
                        </div>
                        <ul style={{ paddingLeft:18, marginTop:6 }}>
                          {(exp.bullets || []).map((b, j) => (
                            <li key={j} style={{ color:"#57534e", fontSize:13, marginBottom:3, lineHeight:1.6 }}>{b}</li>
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
                        <div style={{ fontWeight:700, color:"#1c1917", fontSize:13 }}>{p.name}</div>
                        <div style={{ color:"#57534e", fontSize:13, lineHeight:1.6 }}>{p.description}</div>
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
                          <div style={{ fontWeight:700, color:"#1c1917", fontSize:13 }}>{e.degree}</div>
                          <div style={{ color:"#78716c", fontSize:12 }}>{e.school}</div>
                        </div>
                        <div style={{ color:"#78716c", fontSize:12 }}>{e.year}</div>
                      </div>
                    ))}
                  </ResumeSection>
                )}

                {/* Skills */}
                <ResumeSection title="Skills" icon="⚡">
                  <div style={{ color:"#44403c", fontSize:13, lineHeight:1.8 }}>{improvedResume.skills}</div>
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