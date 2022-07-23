import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import IPatient from '../../interfaces/Patient';
import {Container, Text, Title, ContentLeft, ContentRight} from './styles';

interface Props extends IPatient {
  onPressEdit(): void;
  onPressExclude(): void;
}

const toLocaleDateString = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.log(error);
    return '';
  }
};

const Patient: React.FC<Props> = ({
  birthday,
  name,
  type,
  created_at,
  onPressEdit,
  onPressExclude,
}) => (
  <Container>
    <ContentLeft>
      <Title>{name}</Title>
      <Text>tipo: {type?.name}</Text>
      <Text>nascimento: {toLocaleDateString(birthday)}</Text>
      <Text>criado: {toLocaleDateString(created_at)}</Text>
    </ContentLeft>
    <ContentRight>
      <Icons name="delete" size={25} color="red" onPress={onPressExclude} />
      <Icons name="pencil" size={25} onPress={onPressEdit} />
    </ContentRight>
  </Container>
);

export default Patient;
