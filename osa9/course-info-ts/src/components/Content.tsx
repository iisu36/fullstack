import { ContentProps, CoursePart } from '../types';
import Part from './Part';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Content = (props: ContentProps) => {
  const courseParts = props.courseParts;
  return (
    <>
      {courseParts.map((part: CoursePart) => {
        switch (part.kind) {
          case 'basic':
            return (
              <Part
                key={part.name}
                name={part.name}
                description={part.description}
                kind={part.kind}
                exerciseCount={part.exerciseCount}
              />
            );
          case 'group':
            return (
              <Part
                key={part.name}
                name={part.name}
                groupProjectCount={part.groupProjectCount}
                kind={part.kind}
                exerciseCount={part.exerciseCount}
              />
            );
          case 'background':
            return (
              <Part
                key={part.name}
                name={part.name}
                description={part.description}
                kind={part.kind}
                backroundMaterial={part.backroundMaterial}
                exerciseCount={part.exerciseCount}
              />
            );
          case 'special':
            return (
              <Part
                key={part.name}
                name={part.name}
                requirements={part.requirements}
                description={part.description}
                kind={part.kind}
                exerciseCount={part.exerciseCount}
              />
            );
          default:
            return assertNever(part);
        }
      })}
    </>
  );
};

export default Content;
