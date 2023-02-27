import diagnoseData from '../../data/diagnosesData';

import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnoseData;

const getEntries = (): Diagnose[] => {
  console.log(diagnoses);
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose,
};
