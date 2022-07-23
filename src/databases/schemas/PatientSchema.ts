export const PatientSchema = {
  name: 'Patient',
  properties: {
    _id: 'string',
    name: 'string',
    type: 'TypesPatient?',
    created_at: 'string',
    birthday: 'string',
  },
  primaryKey: '_id',
};
