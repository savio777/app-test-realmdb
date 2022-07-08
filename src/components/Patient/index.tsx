import React from 'react';

import IPatient from '../../interfaces/Patient';
import {Container, Text, Title} from './styles';

interface Props extends IPatient {
  onPressEdit(): void;
  onPressExclude(): void;
}

const Patient: React.FC<Props> = ({age, name, type, created_at}) => (
  <Container>
    <Title>{name}</Title>
    <Text>idade: {age}</Text>
    <Text>tipo: {type}</Text>
    <Text>criado: {created_at}</Text>
  </Container>
);

export default Patient;
