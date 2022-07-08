import Realm from 'realm';
import {PatientSchema} from './PatientSchema';
import {TypesPatientSchema} from './TypesPatientSchema';

export const getRealm = async () =>
  await Realm.open({
    path: 'patients-app-test',
    schema: [PatientSchema, TypesPatientSchema],
    schemaVersion: 0.1,
  });
