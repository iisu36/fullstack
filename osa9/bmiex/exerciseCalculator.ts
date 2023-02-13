interface ExerciseArguments {
  hoursArray: number[];
  target: number;
}

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExerciseArguments = (args: string[]): ExerciseArguments => {
  if (args.length > 17) throw new Error('Too many arguments');
  if (args.length < 4) throw new Error('Not enough arguments');

  if (args.slice(2).some((predicate) => isNaN(Number(predicate)))) {
    throw new Error('Provided values were not numbers!');
  } else {
    const hoursArray = args.slice(2, -1).map((val) => Number(val));
    const target = Number(args[args.length - 1]);

    return {
      hoursArray,
      target,
    };
  }
};

const calculateExercises = (
  array: number[],
  target: number
): ExerciseResult => {
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

try {
  const { hoursArray, target } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hoursArray, target));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
