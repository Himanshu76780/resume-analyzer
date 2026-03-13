const express = require("express");
const cors = require("cors");
const https = require("https");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const GROQ_API_KEY = "PASTE_YOUR_KEY_HERE";

app.post("/api/analyze", (req, res) => {
  const { prompt } = req.body;

  const requestBody = JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.3,
  });

  const options = {
    hostname: "api.groq.com",
    path: "/openai/v1/chat/completions",
    method: "POST",
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
      console.log("📥 Status:", apiRes.statusCode);
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) return res.status(400).json({ error: parsed.error.message });
        const text = parsed.choices?.[0]?.message?.content || "";
        console.log("✅ Success, response length:", text.length);
        res.json({ text });
      } catch (e) {
        res.status(500).json({ error: "Parse failed", raw: data });
      }
    });
  });

  request.on("error", (err) => res.status(500).json({ error: err.message }));
  request.write(requestBody);
  request.end();
});

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));