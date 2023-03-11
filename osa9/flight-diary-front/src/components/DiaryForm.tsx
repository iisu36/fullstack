import { SyntheticEvent, useState } from 'react';
import { Weather, Visibility, DiaryFormValues } from '../types';

interface Props {
  onSubmit: (values: DiaryFormValues) => void;
}

const DiaryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
  const [comment, setComment] = useState('');

  interface VisibilityOption {
    value: Visibility;
    label: string;
  }

  const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map(
    (v) => ({
      value: v,
      label: v.toString(),
    })
  );

  interface WeatherOption {
    value: Weather;
    label: string;
  }

  const weatherOptions: WeatherOption[] = Object.values(Weather).map((v) => ({
    value: v,
    label: v.toString(),
  }));

  const addDiary = (event: SyntheticEvent) => {
    event.preventDefault();

    onSubmit({
      date,
      visibility,
      weather,
      comment,
    });
    setComment('');
    setDate('');
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={addDiary}>
        <label htmlFor="date">date</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        ></input>
        <br />
        <label htmlFor="visibility">visibility</label>
        {visibilityOptions.map((option) => (
          <span key={option.label}>
            <input
              type="radio"
              name="visibility"
              value={option.value}
              checked={option.value === visibility}
              onChange={() => setVisibility(option.value)}
            />
            {option.label}
          </span>
        ))}
        <br />
        <label htmlFor="weather">weather</label>
        {weatherOptions.map((option) => (
          <span key={option.label}>
            <input
              type="radio"
              name="weather"
              value={option.value}
              checked={option.value === weather}
              onChange={() => setWeather(option.value)}
            />
            {option.label}
          </span>
        ))}
        <br />
        <label htmlFor="comment">comment</label>
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        ></input>
        <br />
        <input type="submit" value="add"></input>
      </form>
    </div>
  );
};

export default DiaryForm;
