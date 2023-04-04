import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  Divider,
  Alert,
  DialogContent,
  Button,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import { Patient, Gender, Diagnosis, EntryWithoutId } from '../../types';
import axios from 'axios';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

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

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const entry = await patientService.addEntry(id as string, values);
      setPatient({ ...patient, entries: patient.entries.concat(entry) });
      setModalOpen(false);
      setError(undefined);
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

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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
        <Dialog fullWidth={true} open={modalOpen} onClose={closeModal}>
          <DialogTitle>Add a new entry</DialogTitle>
          <Divider />
          <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <AddEntryForm
              onSubmit={submitNewEntry}
              onCancel={closeModal}
              diagnosis={diagnosis}
              setError={setError}
            />
          </DialogContent>
        </Dialog>
        <Button
          style={{ marginTop: 20 }}
          variant="contained"
          onClick={() => openModal()}
        >
          Add New Entry
        </Button>
        {patient.entries.length !== 0 && (
          <Typography align="left" variant="h5" my={3}>
            entries
          </Typography>
        )}
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnosis={diagnosis} />
        ))}
      </Box>
    </div>
  );
};

export default PatientPage;
