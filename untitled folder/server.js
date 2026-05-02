require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const https   = require("https");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  "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";

if (!GROQ_API_KEY) {
  console.error("  GROQ_API_KEY is missing. Add it to your .env file.");
  process.exit(1);
}

app.post("/api/analyze", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const requestBody = JSON.stringify({
    model: "llama-3.3-70b-versatile",   // upgraded: more reliable JSON output
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.3,
  });

  const options = {
    hostname: "api.groq.com",
    path: "/openai/v1/chat/completions",
    method: "POST",
    timeout: 35000, // 35-second socket timeout
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  const request = https.request(options, (apiRes) => {
    let data = "";
    apiRes.on("data", (chunk) => { data += chunk; });
    apiRes.on("end", () => {
      console.log("📥 Groq status:", apiRes.statusCode);
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          console.error("❌  Groq error:", parsed.error.message);
          return res.status(400).json({ error: parsed.error.message });
        }
        const text = parsed.choices?.[0]?.message?.content || "";
        console.log("✅ Success, response length:", text.length);
        res.json({ text });
      } catch (e) {
        console.error("❌  Parse error:", e.message);
        res.status(500).json({ error: "Parse failed", raw: data.slice(0, 500) });
      }
    });
  });

  // Fires when the socket times out (no data received within 35s)
  request.on("timeout", () => {
    console.error("❌  Groq request timed out");
    request.destroy();
    if (!res.headersSent) {
      res.status(504).json({ error: "Groq API timed out. Please try again." });
    }
  });

  request.on("error", (err) => {
    console.error("❌  Request error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  });

  request.write(requestBody);
  request.end();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: "llama-3.3-70b-versatile" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`✅  Backend running on http://localhost:${PORT}`)
);