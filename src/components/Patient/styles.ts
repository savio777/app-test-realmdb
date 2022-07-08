import styled from 'styled-components/native';

export const Container = styled.View`
  width: 90%;
  border-width: 1px;
  border-color: gray;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: black;
  margin-bottom: 5px;
`;

export const Title = styled(Text)`
  font-weight: bold;
  font-size: 19px;
`;
