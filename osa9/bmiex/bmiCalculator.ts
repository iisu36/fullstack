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
  } else {
    message = 'Something went wrong';
  }
  return message;
};

console.log(calculateBmi(180, 74));
