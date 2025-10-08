import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();


export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const getGeminiModel = (modelName = "gemini-pro") => {
  return genAI.getGenerativeModel({ model: modelName });
};
