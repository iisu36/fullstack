import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patientsData';

import { Patient, NonSensitivePatientEntry, NewPatientEntry } from '../types';
import toNewPatientEntry from '../utils';

const patients: Patient[] = patientsData.map((obj) => {
  const object = toNewPatientEntry(obj) as Patient;
  object.id = obj.id;
  object.entries = obj.entries;
  return object;
});

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

const addPatient = (entry: NewPatientEntry): Patient => {
  const id = uuid();

  const newPatientEntry = {
    ...entry,
    id: id,
    entries: [],
  };

  patients.push(newPatientEntry);

  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((p) => p.id === id);

  if (entry === undefined) {
    throw new Error('Incorrect id');
  }
  return entry;
};

export default {
  getEntries,
  getNonSensitivePatientEntries,
  addPatient,
  findById,
};
