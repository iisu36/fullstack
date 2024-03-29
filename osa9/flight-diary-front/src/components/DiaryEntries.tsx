import { DiaryEntry } from '../types';

const DiaryEntries = ({ diaries }: { diaries: DiaryEntry[] }) => {
  const noMarginStyle = {
    margin: 0,
  };

  return (
    <div>
      <h3>Diary entries</h3>
      {diaries.map((entry) => {
        return (
          <div key={entry.id}>
            <h4>{entry.date}</h4>
            <p style={noMarginStyle}>visibility: {entry.visibility}</p>
            <p style={noMarginStyle}>weather: {entry.weather}</p>
            {entry.comment && (
              <p style={noMarginStyle}>comment: {entry.comment}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiaryEntries;
