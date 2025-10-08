import express from "express";
import { healthcareBot } from "../services/healthcareBot.js";
import { agricultureBot } from "../services/agricultureBot.js";
import { environmentBot } from "../services/environmentBot.js";

const router = express.Router();

router.post("/:domain", async (req, res) => {
  const { domain } = req.params;
  const { message, location } = req.body; 

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    let reply;

    switch (domain.toLowerCase()) {
      case "healthcare":
        reply = await healthcareBot(message);
        break;

      case "agriculture":
        reply = await agricultureBot(message, location); 
        break;

      case "environment":
        reply = await environmentBot(message, location); 
        break;

      default:
        return res.status(400).json({
          error: "Invalid domain. Use one of: healthcare, agriculture, environment",
        });
    }

    res.json({ reply });
  } catch (err) {
    console.error(`Error in ${domain} bot:`, err.message);
    res.status(500).json({
      error: "Chatbot error",
      details: err.message,
    });
  }
});

export default router;
