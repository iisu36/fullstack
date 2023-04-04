import { Box, Typography } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { Diagnosis, Entry, HealthCheckRating } from '../../types';

const EntryDetails: React.FC<{ entry: Entry; diagnosis: Diagnosis[] }> = ({
  entry,
  diagnosis,
}) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntry entry={entry} diagnosis={diagnosis} />;
    case 'OccupationalHealthcare':
      return <OccupationalEntry entry={entry} diagnosis={diagnosis} />;
    case 'HealthCheck':
      return <HealthEntry entry={entry} diagnosis={diagnosis} />;
    default:
      return assertNever(entry);
  }
};

const getDiagnose = (code: string, diagnosis: Diagnosis[]) => {
  if (diagnosis.length === 0) return null;
  const diagnose = diagnosis.find((diagnose) => diagnose.code === code);
  if (typeof diagnose === 'undefined') return null;
  return diagnose.name as string;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HealthDetails: React.FC<{ healthCheckRating: HealthCheckRating }> = ({
  healthCheckRating,
}) => {
  switch (healthCheckRating) {
    case 0:
      return <FavoriteIcon sx={{ color: '#8bc34a' }} />;
    case 1:
      return <FavoriteIcon sx={{ color: '#ffeb3b' }} />;
    case 2:
      return <FavoriteIcon sx={{ color: '#ff9800' }} />;
    case 3:
      return <HeartBrokenIcon sx={{ color: '#f44336' }} />;
    default:
      return <FavoriteIcon />;
  }
};

const HospitalEntry = ({
  entry,
  diagnosis,
}: {
  entry: Entry;
  diagnosis: Diagnosis[];
}) => {
  if (entry.type === 'Hospital') {
    return (
      <Box
        key={entry.date}
        borderRadius={'16px'}
        border={1}
        p={'5px'}
        my={'5px'}
      >
        <Typography align="left" variant="body2">
          {entry.date} <HealingIcon />
        </Typography>
        <Typography align="left" variant="body2">
          <i>{entry.description}</i>
        </Typography>
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>{code + ' ' + getDiagnose(code, diagnosis)}</li>
            ))}
          </ul>
        )}
        {entry.discharge && (
          <Typography align="left" variant="body2">
            discharge on {entry.discharge.date} if{' '}
            {entry.discharge.criteria.toLowerCase()}
          </Typography>
        )}
        <Typography align="left" variant="body2">
          diagnose by {entry.specialist}
        </Typography>
      </Box>
    );
  }
  return null;
};

const HealthEntry = ({
  entry,
  diagnosis,
}: {
  entry: Entry;
  diagnosis: Diagnosis[];
}) => {
  if (entry.type === 'HealthCheck') {
    return (
      <Box
        key={entry.date}
        borderRadius={'16px'}
        border={1}
        p={'5px'}
        my={'5px'}
      >
        <Typography align="left" variant="body2">
          {entry.date} <MedicalServicesIcon />
        </Typography>
        <Typography align="left" variant="body2">
          <i>{entry.description}</i>
        </Typography>
        <HealthDetails healthCheckRating={entry.healthCheckRating} />
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>{code + ' ' + getDiagnose(code, diagnosis)}</li>
            ))}
          </ul>
        )}

        <Typography align="left" variant="body2">
          diagnose by {entry.specialist}
        </Typography>
      </Box>
    );
  }
  return null;
};

const OccupationalEntry = ({
  entry,
  diagnosis,
}: {
  entry: Entry;
  diagnosis: Diagnosis[];
}) => {
  if (entry.type === 'OccupationalHealthcare') {
    return (
      <Box
        key={entry.date}
        borderRadius={'16px'}
        border={1}
        p={'5px'}
        my={'5px'}
      >
        <Typography align="left" variant="body2">
          {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
        </Typography>
        <Typography align="left" variant="body2">
          <i>{entry.description}</i>
        </Typography>
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>{code + ' ' + getDiagnose(code, diagnosis)}</li>
            ))}
          </ul>
        )}
        {entry.sickLeave && (
          <Typography align="left" variant="body2">
            sickleave from {entry.sickLeave.startDate} to{' '}
            {entry.sickLeave.endDate}
          </Typography>
        )}
        <Typography align="left" variant="body2">
          diagnose by {entry.specialist}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default EntryDetails;
