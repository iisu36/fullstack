import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { Weather, Visibility, DiaryFormValues } from '../types';

interface Props {
  onSubmit: (values: DiaryFormValues) => void;
}

const DiaryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
  const [comment, setComment] = useState('');

  const onVisibilityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const visibility = Object.values(Visibility).find(
        (v) => v.toString() === value
      );
      if (visibility) {
        setVisibility(visibility);
      }
    }
  };

  const onWeatherChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const weather = Object.values(Weather).find(
        (w) => w.toString() === value
      );
      if (weather) {
        setWeather(weather);
      }
    }
  };

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
        <select
          name="visibility"
          value={visibility}
          onChange={onVisibilityChange}
        >
          {visibilityOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="weather">weather</label>
        <select name="weather" value={weather} onChange={onWeatherChange}>
          {weatherOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
