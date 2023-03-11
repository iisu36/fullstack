import { useState, useEffect } from 'react';
import axios from 'axios';
import { DiaryEntry, DiaryFormValues } from './types';
import DiaryEntries from './components/DiaryEntries';
import DiaryForm from './components/DiaryForm';

const apiBaseUrl = 'http://localhost:3001/api';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios
      .get<DiaryEntry[]>(`${apiBaseUrl}/diaries`)
      .then((response) => setDiaries(response.data));
  }, []);

  const submitNewDiary = async (values: DiaryFormValues) => {
    try {
      const response = await axios.post<DiaryEntry>(
        `${apiBaseUrl}/diaries`,
        values
      );
      const diary = response.data;
      setDiaries(diaries.concat(diary));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );
          console.error(message);
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  return (
    <div>
      {error !== '' && error}
      <DiaryForm onSubmit={submitNewDiary} />
      <DiaryEntries diaries={diaries} />
    </div>
  );
};

export default App;
