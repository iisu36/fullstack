import { Box, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import { Patient, Gender } from '../../types';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getOne(id as string);
      setPatient(patient);
    };
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
      </Box>
    </div>
  );
};

export default PatientPage;
