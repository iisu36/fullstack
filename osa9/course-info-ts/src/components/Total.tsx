import { ContentProps } from '../types';

const Total = (props: ContentProps) => {
  const courseParts = props.courseParts;
  return (
    <>
      <p>
        Number of exercises{' '}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </>
  );
};

export default Total;
