// Vercel Serverless Function — proxy for TokenRouter API
// Place this file at: api/chat.js  (in the root of your Vercel project)
// Keeps the API key hidden from the browser and adds CORS headers.

const API_BASE_URL = "https://api.tokenrouter.com/v1";
const API_KEY = "sk-Ls47WjytD05FwZjANIVOPa8eB6d00kFjAcWgYMOVkj33ReyK";

export default async function handler(req, res) {
  // CORS headers — allow your site + localhost during development.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.text();
    res.status(upstream.status).setHeader("Content-Type", "application/json").send(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error: " + err.message });
  }
}
