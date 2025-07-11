import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const generateCart = async (req, res) => {
  try {
    const response = await axios.post(process.env.ML_API_URL, req.body);

    // ✨ Forward both products and GPT keywords to frontend
    const { products, keywords } = response.data;
    res.json({ products, keywords: keywords || [] });

  } catch (error) {
    console.error("❌ ML connection failed:", error.message);
    res.status(500).json({ error: "ML service not responding 😢" });
  }
};
