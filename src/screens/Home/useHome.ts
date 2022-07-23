import {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import {useMaskedInputProps, Masks} from 'react-native-mask-input';
import {showMessage} from 'react-native-flash-message';

import {getRealm} from '../../databases/realm';
import IPatient from '../../interfaces/Patient';
import ITypesPatient from '../../interfaces/TypesPatient';
import mockupListTypes from '../../helpers/mockupListTypes';

export default () => {
  const [loading, setLoading] = useState(false);
  const [newOrUpdatePatient, setNewOrUpdatePatient] = useState<
    'new' | 'update'
  >('new');
  const [patient, setPatient] = useState<Partial<IPatient>>();
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [typesPatient, setTypesPatient] = useState<ITypesPatient[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState<string | undefined>('');
  const [birthday, setBirthday] = useState('');

  const maskedInputDateProps = useMaskedInputProps({
    value: birthday,
    onChangeText: setBirthday,
    mask: Masks.DATE_DDMMYYYY,
  });

  async function initTyepsPatients() {
    const realm = await getRealm();

    try {
      realm.write(() => {
        mockupListTypes.map(mockupListType => {
          realm.create('TypesPatient', {
            _id: uuid.v4(),
            name: mockupListType.name,
          });
        });
      });

      getTypesPatients();
    } catch (error) {
      console.log('err onFirstOpen', error);
    }
  }

  async function getTypesPatients() {
    const realm = await getRealm();

    try {
      const typesPatientsStored =
        realm.objects<ITypesPatient[]>('TypesPatient');

      if (typesPatientsStored.toJSON().length > 0) {
        setTypesPatient(typesPatientsStored.toJSON());
      } else {
        initTyepsPatients();
        return;
      }

      getPatients();
    } catch (error) {
      console.log('err', error);
      showMessage({
        message: 'Erro ao pegar tipos de pacientes',
        type: 'danger',
      });
    }
  }

  async function getTypePatient(
    id: string | undefined,
  ): Promise<ITypesPatient | undefined> {
    const realm = await getRealm();

    try {
      const typePatient = realm
        .objects<ITypesPatient>('TypesPatient')
        .filtered(`_id == "${id}"`)[0];

      return typePatient;
    } catch (error) {
      console.log('err', error);
      showMessage({
        message: 'Erro ao pegar tipo de paciente',
        type: 'danger',
      });
    }
  }

  async function getPatients() {
    const realm = await getRealm();
    try {
      setLoading(true);

      const patientsStored = realm.objects<IPatient[]>('Patient');

      setPatients(patientsStored.toJSON());

      setLoading(false);
    } catch (error) {
      console.log('err', error);
      showMessage({
        message: 'Erro ao pegar lista de pacientes',
        type: 'danger',
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    getTypesPatients();
  }, []);

  function verifyInputs() {
    if (name === '' || type === undefined || birthday === '') {
      showMessage({message: 'Alguns campos estão em branco', type: 'warning'});
      return;
    }
  }

  function cleanInputs() {
    setLoading(false);
    setName('');
    setType('');
    setBirthday('');
  }

  async function handleNewPatient() {
    verifyInputs();

    const realm = await getRealm();

    try {
      setLoading(true);

      const getType = await getTypePatient(type);

      realm.write(() => {
        realm.create('Patient', {
          ///_id: new BSON.ObjectID(),
          _id: uuid.v4(),
          name,
          type: getType,
          created_at: String(new Date()),
          birthday: String(new Date(birthday)),
        });

        showMessage({message: 'Paciente cadastrado', type: 'success'});
      });

      getPatients();
    } catch (error) {
      console.log('err', error);
      showMessage({message: 'Erro ao acessar a base de dados', type: 'danger'});
    } finally {
      cleanInputs();
    }
  }

  function setInputsUpdatePatient(patientUpdate: IPatient) {
    setNewOrUpdatePatient('update');
    setPatient(patientUpdate);
    setName(patientUpdate?.name);
    setType(patientUpdate?.type?._id);
    setBirthday(
      String(new Date(patientUpdate?.birthday).toLocaleDateString('pt-BR')),
    );
  }

  async function handleUpdatePatient() {
    verifyInputs();

    const realm = await getRealm();

    try {
      const getPatient = realm
        .objects<IPatient>('Patient')
        .filtered(`_id == "${patient?._id}"`);

      const getType = await getTypePatient(type);

      if (getPatient.length > 0 && getType) {
        const patientUpdate = getPatient[0];
        realm.write(() => {
          patientUpdate.name = name;
          patientUpdate.type = getType;
          patientUpdate.birthday = birthday;
        });
      }

      showMessage({message: 'Paciente atualizado', type: 'success'});

      getPatients();
    } catch (error) {
      console.log('err', error);
      showMessage({message: 'Erro ao atualizar os dados', type: 'danger'});
    } finally {
      cleanInputs();
    }
  }

  async function handleDeleteAllPatients() {
    const realm = await getRealm();

    try {
      realm.write(() => {
        realm.delete(realm.objects('Patient'));
      });

      showMessage({message: 'Pacientes deletados', type: 'warning'});

      getPatients();
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePatient(id?: string) {
    const realm = await getRealm();

    try {
      const patientDelete = realm.objects('Patient').filtered(`_id == "${id}"`);

      if (patientDelete.length > 0) {
        realm.write(() => {
          realm.delete(patientDelete[0]);
        });

        showMessage({message: 'Paciente deletado', type: 'warning'});
      }

      getPatients();
    } catch (error) {
      console.log(error);
    }
  }

  return {
    deletePatient,
    handleDeleteAllPatients,
    handleUpdatePatient,
    setInputsUpdatePatient,
    loading,
    setLoading,
    patients,
    patient,
    handleNewPatient,
    newOrUpdatePatient,
    setNewOrUpdatePatient,
    maskedInputDateProps,
    name,
    setName,
    birthday,
    setBirthday,
    type,
    setType,
    typesPatient,
  };
};
