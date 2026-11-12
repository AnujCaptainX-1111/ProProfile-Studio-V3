/**
 * ==============================================================================
 * PROPROFILE STUDIO - SECURE BACKEND SERVER (server.js)
 * ==============================================================================
 * This backend server safely connects your frontend to an AI API.
 *
 * Beginner Guide:
 * 1. Security: Your API keys stay in the `.env` file on your computer.
 *    The browser (frontend) NEVER sees or touches your private API key.
 * 2. Zero-dependency: Built using standard Node.js libraries (http, fs, path).
 *    No npm install required! You can run it with: node server.js
 * 3. Supports Google Gemini (Free tier available) & OpenAI.
 * 4. Graceful Fallback: If no API key is found or AI fails, it notifies the
 *    frontend to use our built-in offline template generator.
 * ==============================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

/* ------------------------------------------------------------------------------
   1. BUILT-IN .ENV FILE PARSER (No external packages required)
   Reads key-value pairs from a local '.env' file into process.env.
   ------------------------------------------------------------------------------ */
function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  try {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split("\n");

    for (let line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) continue;

      const equalIndex = trimmed.indexOf("=");
      if (equalIndex > 0) {
        const key = trimmed.slice(0, equalIndex).trim();
        let value = trimmed.slice(equalIndex + 1).trim();

        // Remove surrounding single or double quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Only set if not already set by system environment
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (err) {
    console.warn("Could not read .env file:", err.message);
  }
}

// Load .env variables on server startup
loadEnvFile();

const PORT = process.env.PORT || 3000;

/* ------------------------------------------------------------------------------
   2. DETECT CONFIGURED AI PROVIDER
   ------------------------------------------------------------------------------ */
function getAIProvider() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return { name: "gemini", key: process.env.GEMINI_API_KEY.trim() };
  }
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
    return { name: "openai", key: process.env.OPENAI_API_KEY.trim() };
  }
  return null;
}

/* ------------------------------------------------------------------------------
   3. AI CALL HANDLERS (GEMINI & OPENAI)
   ------------------------------------------------------------------------------ */

/**
 * Constructs the prompt enforcing Rule 13: strictly polishing genuine facts
 * without hallucinating false credentials.
 */
function buildAIPrompt(data) {
  return `You are a professional LinkedIn profile optimization expert.
Transform the candidate's provided information into an engaging, high-impact LinkedIn profile.

CRITICAL INTEGRITY RULES:
1. Do NOT invent, fabricate, or assume any qualifications, employers, degrees, awards, or metrics not explicitly supplied by the candidate.
2. Rely strictly on the candidate's genuine details below.
3. Tone preference requested: "${data.tone || "modern"}".

CANDIDATE INFORMATION:
- Full Name: ${data.fullname}
- Target Role / Career Goal: ${data.role}
- Industry / Specialty: ${data.industry || "Not specified"}
- Education: ${data.education}
- Skills: ${data.skills}
- Work Experience: ${data.experience || "None provided"}
- Projects: ${data.projects || "None provided"}
- Achievements / Awards: ${data.achievements || "None provided"}

OUTPUT REQUIREMENTS:
Return ONLY valid JSON (no markdown fences, no explanatory preamble) with this exact structure:
{
  "headlinePrimary": "A compelling LinkedIn headline (under 220 chars) with role and top skills",
  "headlineVariant1": "A skill-focused headline variant",
  "headlineVariant2": "An impact and growth-focused headline variant",
  "about": "A complete, beautifully formatted LinkedIn About section with an opening hook, education foundation, bulleted competencies, experience/project narrative, achievements (if provided), and a friendly call to connect.",
  "experience": "Formatted LinkedIn experience bullets (or a friendly message if no experience was provided)",
  "education": "Formatted LinkedIn education section highlighting degree, institution, and notable coursework or honors",
  "skills": "Categorized LinkedIn skills showcase (e.g. Core Technical Skills, Frameworks & Tools, Professional Competencies)",
  "projects": "Formatted LinkedIn project highlights (or a friendly message if no projects were provided)"
}`;
}

/**
 * Call Google Gemini API (gemini-1.5-flash)
 */
async function callGemini(apiKey, prompt) {
  // Use gemini-1.5-flash for speed and free tier compatibility
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: "application/json" // Gemini native JSON enforcement
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedError;
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      parsedError = { message: errorText };
    }

    const status = response.status;
    if (status === 400 || status === 403) {
      throw new Error(`Google Gemini API Key error (${status}). Please check your GEMINI_API_KEY in .env.`);
    } else if (status === 429) {
      throw new Error("Google Gemini API rate limit reached. Please wait a moment or use Template Mode.");
    } else {
      throw new Error(`Gemini API Error (${status}): ${parsedError.error?.message || errorText}`);
    }
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  // Clean and parse JSON
  const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * Call OpenAI API (gpt-4o-mini)
 */
async function callOpenAI(apiKey, prompt) {
  const url = "https://api.openai.com/v1/chat/completions";

  const requestBody = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional LinkedIn career consultant who always responds with valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    const status = response.status;
    if (status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.");
    } else if (status === 429) {
      throw new Error("OpenAI API rate limit or quota exceeded. Please check your billing or use Template Mode.");
    } else {
      throw new Error(`OpenAI API error (${status}): ${errorText}`);
    }
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  return JSON.parse(content);
}

/* ------------------------------------------------------------------------------
   4. HTTP REQUEST ROUTER
   ------------------------------------------------------------------------------ */
const server = http.createServer(async (req, res) => {
  // Enable CORS for local cross-origin flexibility
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // ROUTE 1: Status Check (GET /api/status)
  // Safely tells the frontend if AI is configured WITHOUT revealing the secret key
  if (req.method === "GET" && pathname === "/api/status") {
    const provider = getAIProvider();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        aiConfigured: Boolean(provider),
        provider: provider ? provider.name : null
      })
    );
    return;
  }

  // ROUTE 2: AI Generation Endpoint (POST /api/generate)
  if (req.method === "POST" && pathname === "/api/generate") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Guard against huge payload spam (max 1MB)
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");

        // Server-side validation
        if (!data.fullname || !data.role || !data.education || !data.skills) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: "Missing required fields: Full Name, Role, Education, and Skills are required."
            })
          );
          return;
        }

        const provider = getAIProvider();

        // If no API key configured, advise frontend to trigger template fallback
        if (!provider) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              fallback: true,
              message: "No AI API key found in .env. Falling back to high-quality template generator."
            })
          );
          return;
        }

        // Call the configured AI provider
        const prompt = buildAIPrompt(data);
        let aiResult;

        if (provider.name === "gemini") {
          aiResult = await callGemini(provider.key, prompt);
        } else if (provider.name === "openai") {
          aiResult = await callOpenAI(provider.key, prompt);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            provider: provider.name,
            data: aiResult
          })
        );
      } catch (err) {
        console.error("AI Generation Error:", err.message);

        // Tell frontend that generation failed so it can use fallback seamlessly
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            fallback: true,
            error: err.message
          })
        );
      }
    });

    return;
  }

  // ROUTE 3: Static File Server (HTML, CSS, JS, etc.)
  let filePath = pathname === "/" ? "/index.html" : pathname;
  filePath = path.join(__dirname, filePath);

  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".png": "image/png"
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

/* ------------------------------------------------------------------------------
   5. START SERVER
   ------------------------------------------------------------------------------ */
server.listen(PORT, () => {
  const provider = getAIProvider();
  console.log("\n========================================================");
  console.log("🚀 ProProfile Studio Server is running!");
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  if (provider) {
    console.log(`✨ AI Mode: Active (Provider: ${provider.name.toUpperCase()})`);
  } else {
    console.log("⚡ AI Mode: No API key found in .env (Using offline templates)");
    console.log("💡 Tip: Add GEMINI_API_KEY to your .env file to enable AI generation.");
  }
  console.log("========================================================\n");
});
