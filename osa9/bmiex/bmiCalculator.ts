interface BmiArguments {
  height: number;
  mass: number;
}

const parseBmiArguments = (args: string[]): BmiArguments => {
  if (args.length > 4) throw new Error('Too many arguments');
  if (args.length < 4) throw new Error('Not enough arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      mass: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (height: number, mass: number): string => {
  let message;

  const bmi = mass / ((height / 100) ^ 2);

  if (bmi < 16) {
    message = 'Underweight (Severe thinness)';
  } else if (bmi < 17) {
    message = 'Underweight (Moderate thinnes)';
  } else if (bmi < 18.5) {
    message = 'Underweight (Mild thinness';
  } else if (bmi < 25) {
    message = 'Normal (Healthy weight)';
  } else if (bmi < 30) {
    message = 'Overweight (Pre-obese)';
  } else if (bmi < 35) {
    message = 'Obese (Class I)';
  } else if (bmi < 40) {
    message = 'Obese (Class II)';
  } else if (bmi >= 40) {
    message = 'Obese (Class III)';
  }
  return message;
};

try {
  const { height, mass } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, mass));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
