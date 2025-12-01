import express from "express";
import scrape from "./api/scrape.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("LSE Playwright Proxy is running.");
});

app.get("/scrape", async (req, res) => {
  try {
    const result = await scrape();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
