import Realm from 'realm';

import {PatientSchema} from './schemas/PatientSchema';
import {TypesPatientSchema} from './schemas/TypesPatientSchema';

export const getRealm = async () =>
  await Realm.open({
    path: 'patients-app-test',
    schema: [PatientSchema, TypesPatientSchema],
    schemaVersion: 0.1,
  });
