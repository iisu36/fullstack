import { Box, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import { Patient, Gender, Diagnosis } from '../../types';

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
          <div key={entry.date}>
            <Typography align="left" variant="body2">
              {entry.date} <i>{entry.description}</i>
            </Typography>
            <ul>
              {entry.diagnosisCodes &&
                entry.diagnosisCodes.map((code) => (
                  <li key={code}>
                    {code + ' ' + getDiagnose(code, diagnosis)}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default PatientPage;
