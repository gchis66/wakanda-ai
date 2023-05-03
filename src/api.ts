import express from "express";
import { getWakandaAIResponse } from "./chains/question_answer_docs";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post("/api/wakanda", async (req, res) => {
  const { character, question } = req.body;
  try {
    const response = await getWakandaAIResponse(character, question);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
