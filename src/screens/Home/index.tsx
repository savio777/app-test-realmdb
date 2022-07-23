import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {Container, List, ContentRow} from './styles';
import {Input, Button, Patient} from '../../components';
import useHome from './useHome';

export default () => {
  const {
    deletePatient,
    handleDeleteAllPatients,
    handleNewPatient,
    handleUpdatePatient,
    loading,
    maskedInputDateProps,
    newOrUpdatePatient,
    patients,
    setInputsUpdatePatient,
    name,
    setName,
    setType,
    type,
    typesPatient,
  } = useHome();

  return (
    <Container>
      {loading && <ActivityIndicator />}
      <Input placeholder="Nome" onChangeText={setName} value={name} />
      <Picker
        selectedValue={type}
        onValueChange={value => setType(value)}
        style={{width: '95%'}}>
        <Picker.Item value={null} label="Selecione o tipo" />
        {typesPatient.map((typePatient, index) => (
          <Picker.Item
            key={String(index)}
            value={typePatient._id}
            label={typePatient.name}
          />
        ))}
      </Picker>
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
        {patients.map((p, index) => (
          <Patient
            key={String(index)}
            onPressEdit={() => setInputsUpdatePatient(p)}
            onPressExclude={() => deletePatient(p._id)}
            name={p.name}
            birthday={p.birthday}
            created_at={p.created_at}
            type={p.type}
            _id={p._id}
          />
        ))}
      </List>
    </Container>
  );
};
