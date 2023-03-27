import { Box, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import {
  Patient,
  Gender,
  Diagnosis,
  Entry,
  HealthCheckRating,
} from '../../types';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getOne(id as string);
      setPatient(patient);
    };
    const fetchDiagnosis = async () => {
      const diagnosis = await diagnosisService.getAll();
      setDiagnosis(diagnosis);
    };
    void fetchDiagnosis();
    void fetchPatient();
  }, [id]);

  if (patient === undefined) return null;

  const genderIcon = () => {
    if (patient.gender === Gender.Male) {
      return <MaleIcon></MaleIcon>;
    }
    if (patient.gender === Gender.Female) {
      return <FemaleIcon></FemaleIcon>;
    }
    if (patient.gender === Gender.Other) {
      return null;
    }
    return null;
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

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return <HospitalEntry entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalEntry entry={entry} />;
      case 'HealthCheck':
        return <HealthEntry entry={entry} />;
      default:
        return assertNever(entry);
    }
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

  const HospitalEntry = ({ entry }: { entry: Entry }) => {
    if (entry.type === 'Hospital') {
      return (
        <Box key={entry.date} borderRadius={'16px'} border={1} p={'5px'}>
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

  const HealthEntry = ({ entry }: { entry: Entry }) => {
    if (entry.type === 'HealthCheck') {
      return (
        <Box key={entry.date} borderRadius={'16px'} border={1} p={'5px'}>
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

  const OccupationalEntry = ({ entry }: { entry: Entry }) => {
    if (entry.type === 'OccupationalHealthcare') {
      return (
        <Box key={entry.date} borderRadius={'16px'} border={1} p={'5px'}>
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

  return (
    <div>
      <Box>
        <Typography align="left" variant="h4" my={3}>
          {patient.name} {genderIcon()}
        </Typography>
        <Typography align="left" variant="body2">
          ssh: {patient.ssn} <br />
          occupation: {patient.occupation}
        </Typography>
        {patient.entries.length !== 0 && (
          <Typography align="left" variant="h5" my={3}>
            entries
          </Typography>
        )}
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </Box>
    </div>
  );
};

export default PatientPage;
