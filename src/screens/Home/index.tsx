import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import uuid from 'react-native-uuid';
import {useMaskedInputProps, Masks} from 'react-native-mask-input';

import {Input, Button, Patient} from '../../components';
import {getRealm} from '../../databases/schemas/realm';
import {Container, List} from './styles';
import IPatient from '../../interfaces/Patient';

export default () => {
  const [loading, setLoading] = useState(false);
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

  async function handleNewPatient() {
    if (name === '' || type === '' || birthday === '') {
      Alert.alert('Aviso', 'Alguns campos estão em branco');
      return;
    }

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
      });

      realm.close();

      getPatients();
    } catch (error) {
      console.log('err', error);
      Alert.alert('Erro', 'erro ao acessar a base de dados');
      realm.close();
    } finally {
      setLoading(false);
      setName('');
      setType('');
      setBirthday('');
    }
  }

  async function deletePatient(id: string) {
    const realm = await getRealm();

    try {
      const patientDelete = realm.objects('Patient').filtered(`_id == "${id}"`);

      if (patientDelete.length > 0) {
        realm.write(() => {
          realm.delete(patientDelete[0]);
        });

        Alert.alert('Atenção', 'paciente deletado');
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
      <Input {...maskedInputDateProps} placeholder="Data de nascimento" />
      <Button onPress={handleNewPatient}>Cadastrar</Button>

      <List>
        {patients.map((patient, index) => (
          <Patient
            key={String(index)}
            onPressEdit={() => {}}
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
