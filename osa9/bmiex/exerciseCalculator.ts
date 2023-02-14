interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  array: number[],
  target: number
): ExerciseResult => {
  const periodLength = array.length;

  const trainingDays = array.filter((hours) => hours !== 0).length;

  const average = array.reduce((acc, val) => acc + val, 0) / periodLength;

  const success = average >= target;

  let rating = 0;
  let ratingDescription = '';

  if (success) {
    rating = 3;
    ratingDescription = 'excellent!';
  } else if ((target - average) / target <= 0.3) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else if ((target - average) / target > 0.3) {
    rating = 1;
    ratingDescription = 'did you even try?';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};
