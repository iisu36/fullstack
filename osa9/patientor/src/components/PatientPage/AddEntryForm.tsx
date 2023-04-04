import { useState, SyntheticEvent } from 'react';

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
} from '@mui/material';

import {
  EntryWithoutId,
  EntryType,
  HealthCheckRating,
  Diagnosis,
} from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  diagnosis: Diagnosis[];
  setError: (error: string) => void;
}

interface EntryOption {
  value: EntryType;
  label: string;
}

const entryOptions: EntryOption[] = Object.values(EntryType).map((v) => ({
  value: v,
  label: v.toString(),
}));

interface HealthCheckOption {
  value: HealthCheckRating;
  label: string;
}

const healthCheckOptions: HealthCheckOption[] = Object.values(HealthCheckRating)
  .filter((v) => !isNaN(Number(v)))
  .map((v) => ({ value: v as HealthCheckRating, label: v.toString() }));

const AddEntryForm = ({ onCancel, onSubmit, diagnosis, setError }: Props) => {
  const [entryType, setEntryType] = useState(EntryType.Hospital);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeave, setSickLeave] = useState({ startDate: '', endDate: '' });
  const [discharge, setDischarge] = useState({ date: '', criteria: '' });

  const onEntryChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const entryType = Object.values(EntryType).find(
        (e) => e.toString() === value
      );
      if (entryType) {
        setEntryType(entryType);
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'number') {
      const value = event.target.value;
      const healthCheckRating = Object.values(HealthCheckRating)
        .filter((v) => !isNaN(Number(v)))
        .find((e) => e === value);
      if (healthCheckRating) {
        setHealthCheckRating(healthCheckRating as HealthCheckRating);
      }
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    if (description === '' || date === '' || specialist === '') {
      setError('Description, date and specialist are required fields');
    } else {
      switch (entryType) {
        case 'Hospital':
          const hospitalValues = {
            description,
            date,
            specialist,
            diagnosisCodes,
            type: entryType,
          };

          if (discharge.criteria !== '' && discharge.date !== '') {
            onSubmit({ ...hospitalValues, discharge });
          } else {
            onSubmit(hospitalValues);
          }
          break;
        case 'HealthCheck':
          onSubmit({
            description,
            date,
            specialist,
            diagnosisCodes,
            type: entryType,
            healthCheckRating,
          });
          break;
        case 'OccupationalHealthcare':
          if (employerName === '') {
            setError('Employer name is required');
          } else {
            const occupationalValues = {
              description,
              date,
              specialist,
              diagnosisCodes,
              type: entryType,
              employerName,
            };

            if (sickLeave.startDate !== '' && sickLeave.endDate !== '') {
              onSubmit({ ...occupationalValues, sickLeave });
            } else {
              onSubmit(occupationalValues);
            }
          }
      }
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 20 }}>EntryType</InputLabel>
        <Select
          label="EntryType"
          fullWidth
          value={entryType}
          onChange={onEntryChange}
        >
          {entryOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          onChange={({ target }) => setDate(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Diagnosis codes</InputLabel>
        <Select
          multiple
          label="Diagnosis codes"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value as string[])}
        >
          {diagnosis.map((diagnose) => (
            <MenuItem key={diagnose.code} value={diagnose.code}>
              {diagnose.code}
            </MenuItem>
          ))}
        </Select>
        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <InputLabel style={{ marginTop: 20 }}>Sickleave</InputLabel>
            <InputLabel style={{ fontSize: 15 }}>start</InputLabel>
            <TextField
              key="startDate"
              type="date"
              fullWidth
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, startDate: target.value })
              }
            />
            <InputLabel style={{ fontSize: 15 }}>end</InputLabel>
            <TextField
              key="endDate"
              type="date"
              fullWidth
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, endDate: target.value })
              }
            />
          </>
        )}
        {entryType === 'HealthCheck' && (
          <>
            <InputLabel style={{ marginTop: 20 }}>
              Health check rating
            </InputLabel>
            <Select
              label="Health check rating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={onHealthCheckRatingChange}
            >
              {healthCheckOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {entryType === 'Hospital' && (
          <>
            <InputLabel style={{ marginTop: 20 }}>Discharge</InputLabel>
            <InputLabel style={{ fontSize: 15 }}>date</InputLabel>
            <TextField
              type="date"
              fullWidth
              onChange={({ target }) =>
                setDischarge({ ...discharge, date: target.value })
              }
            />
            <TextField
              label="criteria"
              fullWidth
              value={discharge.criteria}
              onChange={({ target }) =>
                setDischarge({ ...discharge, criteria: target.value })
              }
            />
          </>
        )}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right',
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
