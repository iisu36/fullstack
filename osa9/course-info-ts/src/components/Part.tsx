import { CoursePart } from '../types';

const Part = (part: CoursePart) => {
  return (
    <div>
      <p>
        <b>
          {part.name} {part.exerciseCount}
        </b>

        {part.kind === 'basic' && (
          <>
            <br />
            <i>{part.description}</i>
          </>
        )}

        {part.kind === 'group' && (
          <>
            <br />
            project exercises {part.groupProjectCount}
          </>
        )}

        {part.kind === 'background' && (
          <>
            <br />
            <i>{part.description}</i>
            <br />
            submit to {part.backroundMaterial}
          </>
        )}

        {part.kind === 'special' && (
          <>
            <br />
            <i>{part.description}</i>
            <br />
            required skills: {part.requirements.join(', ')}
          </>
        )}
      </p>
    </div>
  );
};

export default Part;
