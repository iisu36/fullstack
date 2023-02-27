import patientsData from '../../data/patientsData';

import { Patient, NonSensitivePatientEntry } from '../types';

const patients: Patient[] = patientsData;

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitivePatientEntries,
  addPatient,
};
