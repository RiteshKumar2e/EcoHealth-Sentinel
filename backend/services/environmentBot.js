import axios from "axios";
import { openai, genAI } from "./aiClient.js";

export const environmentBot = async (message) => {
  try {
    let externalData = "";

    try {
      const nasaRes = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
      );
      externalData += `NASA Climate Insight: ${nasaRes.data.title} - ${nasaRes.data.explanation}\n\n`;
    } catch (err) {
      console.warn("NASA API error:", err.message);
    }


    try {
      const epaRes = await axios.get(
        `https://data.epa.gov/efservice/PM25/JSON/?api_key=${process.env.EPA_API_KEY}`
      );
      if (epaRes.data && epaRes.data.length > 0) {
        externalData += `EPA Air Quality: PM2.5 level around ${epaRes.data[0].Value}\n\n`;
      }
    } catch (err) {
      console.warn("EPA API error:", err.message);
    }

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      externalData += `Weather in Delhi: ${weatherRes.data.weather[0].description}, Temp: ${weatherRes.data.main.temp}°C\n\n`;
    } catch (err) {
      console.warn("Weather API error:", err.message);
    }


    try {
      const aqiRes = await axios.get(process.env.AQI_API_KEY);
      if (aqiRes.data && aqiRes.data.list && aqiRes.data.list.length > 0) {
        externalData += `Air Quality Index: ${aqiRes.data.list[0].main.aqi}\n\n`;
      }
    } catch (err) {
      console.warn("AQI API error:", err.message);
    }


    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const geminiResult = await model.generateContent(
      `You are an environmental assistant. 
      Use the provided real data when relevant.

      Real Data:
      ${externalData}

      User: ${message}`
    );

    const geminiResponse = geminiResult.response.text();
    if (geminiResponse && geminiResponse.trim() !== "") {
      return geminiResponse;
    }

    const openaiResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an environmental assistant. Use real climate, pollution, and weather data if provided.",
        },
        { role: "user", content: `${message}\n\nReal Data:\n${externalData}` },
      ],
    });

    return openaiResult.choices[0].message.content;
  } catch (err) {
    console.error("EnvironmentBot Error:", err);
    return "Sorry, I couldn't fetch environmental advice at this time.";
  }
};
