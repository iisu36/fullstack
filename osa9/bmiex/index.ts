import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

interface ExercisePostResult {
  daily_exercises: number[];
  target: number;
}

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

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as ExercisePostResult;
  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
  }

  if (
    daily_exercises.some((ex) => isNaN(Number(ex))) ||
    isNaN(Number(target))
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(
    daily_exercises.map((ex) => Number(ex)),
    Number(target)
  );
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
