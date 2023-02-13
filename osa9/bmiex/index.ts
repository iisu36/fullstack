import express from 'express';
import { calculateBmi } from './bmiCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (!isNaN(Number(req.query.weight)) && !isNaN(Number(req.query.height))) {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);
    let result = {};
    try {
      result = {
        weight: weight,
        height: height,
        bmi: calculateBmi(height, weight),
      };
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong: ';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      res.status(400).json(errorMessage);
    }
    res.json(result);
  } else {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
