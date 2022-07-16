import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import uuid from 'react-native-uuid';
import {useMaskedInputProps, Masks} from 'react-native-mask-input';
import {showMessage} from 'react-native-flash-message';

import {getRealm} from '../../databases/schemas/realm';
import IPatient from '../../interfaces/Patient';
import {Container, List, ContentRow} from './styles';
import {Input, Button, Patient} from '../../components';

export default () => {
  const [loading, setLoading] = useState(false);
  const [newOrUpdatePatient, setNewOrUpdatePatient] = useState<
    'new' | 'update'
  >('new');
  const [patient, setPatient] = useState<Partial<IPatient>>();
  const [patients, setPatients] = useState<IPatient[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [birthday, setBirthday] = useState('');

  const maskedInputDateProps = useMaskedInputProps({
    value: birthday,
    onChangeText: setBirthday,
    mask: Masks.DATE_DDMMYYYY,
  });

  async function getPatients() {
    try {
      setLoading(true);
      const realm = await getRealm();

      const patientsStored = realm.objects<IPatient>('Patient');

      setPatients(patientsStored.toJSON());

      realm.close();

      setLoading(false);
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  function verifyInputs() {
    if (name === '' || type === '' || birthday === '') {
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

      realm.write(() => {
        realm.create('Patient', {
          ///_id: new BSON.ObjectID(),
          _id: uuid.v4(),
          name,
          type,
          created_at: String(new Date()),
          birthday: String(new Date(birthday)),
        });

        showMessage({message: 'Paciente cadastrado', type: 'success'});
      });

      realm.close();

      getPatients();
    } catch (error) {
      console.log('err', error);
      showMessage({message: 'Erro ao acessar a base de dados', type: 'danger'});
      realm.close();
    } finally {
      cleanInputs();
    }
  }

  function setInputsUpdatePatient(patientUpdate: IPatient) {
    setNewOrUpdatePatient('update');
    setPatient(patientUpdate);
    setName(patientUpdate?.name);
    setType(patientUpdate?.type);
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

      if (getPatient.length > 0) {
        const patientUpdate = getPatient[0];
        realm.write(() => {
          patientUpdate.name = name;
          patientUpdate.type = type;
          patientUpdate.birthday = birthday;
        });
      }

      showMessage({message: 'Paciente atualizado', type: 'success'});

      realm.close();

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

      realm.close();

      getPatients();
    } catch (error) {
      console.log(error);
      realm.close();
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

      realm.close();

      getPatients();
    } catch (error) {
      console.log(error);
      realm.close();
    }
  }

  return (
    <Container>
      {loading && <ActivityIndicator />}
      <Input placeholder="Nome" onChangeText={setName} value={name} />
      <Input placeholder="Tipo paciente" onChangeText={setType} value={type} />
      <Input
        {...maskedInputDateProps}
        placeholder="Data de nascimento"
        onSubmitEditing={() =>
          newOrUpdatePatient === 'new'
            ? handleNewPatient()
            : handleUpdatePatient()
        }
      />
      <ContentRow>
        <Button
          onPress={() =>
            newOrUpdatePatient === 'new'
              ? handleNewPatient()
              : handleUpdatePatient()
          }>
          {newOrUpdatePatient === 'new' ? 'Cadastrar' : 'Atualizar'}
        </Button>
        <Button onPress={handleDeleteAllPatients}>Apagar tudo</Button>
      </ContentRow>

      <List>
        {patients.map((patient, index) => (
          <Patient
            key={String(index)}
            onPressEdit={() => setInputsUpdatePatient(patient)}
            onPressExclude={() => deletePatient(patient._id)}
            name={patient.name}
            birthday={patient.birthday}
            created_at={patient.created_at}
            type={patient.type}
            _id={patient._id}
          />
        ))}
      </List>
    </Container>
  );
};
