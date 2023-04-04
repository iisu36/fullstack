import {
  Gender,
  NewPatientEntry,
  Entry,
  EntryWithoutId,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Diagnose,
} from './types';

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect of missing data');
  }
  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'type' in object
  ) {
    object;
    const newEntry: Omit<Entry, 'id'> = {
      description: parseString(object.description),
      date: parseString(object.date),
      specialist: parseString(object.specialist),
      type: parseType(object.type),
    };
    if ('diagnosisCodes' in object) {
      newEntry['diagnosisCodes'] = parseDiagnosisCodes(object.diagnosisCodes);
    }
    switch (object.type) {
      case 'Hospital':
        if ('discharge' in object) {
          return {
            ...newEntry,
            discharge: parseDischarge(object.discharge),
            type: 'Hospital',
          };
        } else {
          return {
            ...newEntry,
            type: 'Hospital',
          };
        }
      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          if ('sickLeave' in object) {
            return {
              ...newEntry,
              type: 'OccupationalHealthcare',
              sickLeave: parseSickLeave(object.sickLeave),
              employerName: parseString(object.employerName),
            };
          } else {
            return {
              ...newEntry,
              type: 'OccupationalHealthcare',
              employerName: parseString(object.employerName),
            };
          }
        }
        break;
      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          return {
            ...newEntry,
            type: 'HealthCheck',
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
        }
        break;
    }
  }
  throw new Error('Incorrect data: some fields are missing');
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect of missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseString(object.name),
      dateOfBirth: parseString(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: [],
    };

    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};

export const toPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect of missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'entries' in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseString(object.name),
      dateOfBirth: parseString(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: parseEntries(object.entries),
    };

    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isObject = (object: unknown): object is object => {
  return typeof object === 'object' || object instanceof Object;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.keys(HealthCheckRating).includes(param.toString());
};

const isCorrectType = (type: string): type is Entry['type'] => {
  return ['Hospital', 'OccupationalHealthcare', 'HealthCheck'].includes(type);
};

const isCorrectDischarge = (discharge: object): discharge is object => {
  if ('date' in discharge && 'criteria' in discharge) {
    if (isString(discharge.date) && isString(discharge.criteria)) {
      return true;
    }
  }
  return false;
};

const isCorrectSickLeave = (sickLeave: object): sickLeave is object => {
  if ('date' in sickLeave && 'criteria' in sickLeave) {
    if (isString(sickLeave.date) && isString(sickLeave.criteria)) {
      return true;
    }
  }
  return false;
};

const parseString = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error(
      `incorrect or missing ${Object.keys({ text })[0]}: ${text}`
    );
  }

  return text;
};
const parseDiagnosisCodes = (object: unknown): Array<Diagnose['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose['code']>;
  }

  return object.diagnosisCodes as Array<Diagnose['code']>;
};

const parseDischarge = (discharge: unknown): HospitalEntry['discharge'] => {
  if (!isObject(discharge) || !isCorrectDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge: ' + discharge);
  }

  return discharge as HospitalEntry['discharge'];
};

const parseSickLeave = (
  sickLeave: unknown
): OccupationalHealthcareEntry['sickLeave'] => {
  if (!isObject(sickLeave) || !isCorrectSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sickLeave: ' + sickLeave);
  }

  return sickLeave as OccupationalHealthcareEntry['sickLeave'];
};

const parseType = (type: unknown): Entry['type'] => {
  if (!isString(type) || !isCorrectType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }

  return type;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error(
      'Incorrect or missing healthcheck rating: ' + healthCheckRating
    );
  }
  return healthCheckRating;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (Array.isArray(entries)) {
    entries.forEach((entry) => {
      if (!entry || typeof entry !== 'object' || !entry.type) {
        throw new Error('Incorrect of missing data');
      }
      const type: unknown = entry.type;
      if (!isString(type) || !isCorrectType(type)) {
        throw new Error('Incorrect or missing type: ' + entry.type);
      }
    });
  } else {
    throw new Error('incorrect or missing data: ' + entries);
  }

  return entries as Entry[];
};

const parseGender = (gender: unknown): string => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

export default toNewPatientEntry;
