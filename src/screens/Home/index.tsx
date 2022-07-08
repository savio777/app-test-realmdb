import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Text} from 'react-native';
import uuid from 'react-native-uuid';

import {Input, Button, Patient} from '../../components';
import {getRealm} from '../../databases/schemas/realm';
import {Container} from './styles';
import IPatient from '../../interfaces/Patient';

export default () => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('');

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
    const realm = await getRealm();

    try {
      setLoading(true);

      realm.write(() => {
        const newPatient = realm.create('Patient', {
          ///_id: new BSON.ObjectID(),
          _id: uuid.v4(),
          name,
          age: Number(age),
          type,
          created_at: String(new Date()),
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
      setAge('');
      setName('');
      setType('');
    }
  }

  return (
    <Container>
      {loading && <ActivityIndicator />}
      <Input placeholder="Nome" onChangeText={setName} value={name} />
      <Input
        placeholder="Idade"
        onChangeText={setAge}
        value={age}
        keyboardType="numeric"
      />
      <Input placeholder="Tipo paciente" onChangeText={setType} value={type} />
      <Button onPress={handleNewPatient}>Cadastrar</Button>

      {patients.map((patient, index) => (
        <Patient
          key={String(index)}
          onPressEdit={() => {}}
          onPressExclude={() => {}}
          name={patient.name}
          age={patient.age}
          created_at={patient.created_at}
          type={patient.type}
          _id={patient._id}
        />
      ))}
    </Container>
  );
};
