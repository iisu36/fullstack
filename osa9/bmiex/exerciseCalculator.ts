interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (array: number[], target: number): Result => {
  const periodLength = array.length;

  const trainingDays = array.filter((hours) => hours !== 0).length;

  const average = array.reduce((acc, val) => acc + val, 0) / periodLength;

  const success = average >= target;

  let rating, ratingDescription;

  if (success) {
    rating = 3;
    ratingDescription = 'excellent!';
  } else if ((target - average) / target <= 0.3) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else if ((target - average) / target > 0.3) {
    rating = 1;
    ratingDescription = 'did you even try?';
  } else {
    rating = 0;
    ratingDescription = 'something went wrong during calculations';
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
