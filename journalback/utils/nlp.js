import axios from "axios";

export async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      "https://nlp-services.onrender.com/analyze-sentiment",
      { text }
    );
    return response.data.result;
  } catch (err) {
    console.error("NLP error:", err);
    return null;
  }
}
