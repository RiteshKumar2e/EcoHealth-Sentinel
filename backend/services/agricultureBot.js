import axios from "axios";
import { openai, genAI } from "./aiClient.js";

export const agricultureBot = async (message) => {
  try {
    let externalData = "";

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );
      externalData += `Weather: ${weatherRes.data.weather[0].description}, Temp: ${weatherRes.data.main.temp}°C, Humidity: ${weatherRes.data.main.humidity}%\n\n`;
    } catch (err) {
      console.warn("OpenWeather API error:", err.message);
    }


    try {
      const tomorrowRes = await axios.get(
        `https://api.tomorrow.io/v4/weather/forecast?location=Delhi&apikey=${process.env.TOMORROW_API_KEY}`
      );
      if (tomorrowRes.data && tomorrowRes.data.timelines) {
        const forecast = tomorrowRes.data.timelines.daily[0].values;
        externalData += `Tomorrow.io Forecast: Rainfall=${forecast.precipitationSum}mm, Max Temp=${forecast.temperatureMax}°C, Min Temp=${forecast.temperatureMin}°C\n\n`;
      }
    } catch (err) {
      console.warn("Tomorrow.io API error:", err.message);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const geminiResult = await model.generateContent(
      `You are an agriculture assistant. 
      Use the provided real data when relevant to give advice on crops, irrigation, soil, and climate.

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
            "You are an agriculture expert. Use real-time weather & forecast data if available.",
        },
        { role: "user", content: `${message}\n\nReal Data:\n${externalData}` },
      ],
    });

    return openaiResult.choices[0].message.content;
  } catch (err) {
    console.error("AgricultureBot Error:", err);
    return "Sorry, I couldn't fetch agriculture advice at this time.";
  }
};
