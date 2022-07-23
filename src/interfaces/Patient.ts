import TypesPatient from './TypesPatient';

export default interface Patient {
  _id?: string;
  name: string;
  type: TypesPatient;
  created_at: string;
  birthday: string;
};
