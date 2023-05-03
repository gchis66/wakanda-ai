import express from "express";
import cors from "cors";
import { run } from "./chains/question_answer_docs";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/wakanda-ai", async (req, res) => {
  const character = req.query.character as string;
  const question = req.query.question as string;

  if (!character || !question) {
    return res
      .status(400)
      .send({ error: "Character and question are required." });
  }

  try {
    const response = await run(character, question);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
