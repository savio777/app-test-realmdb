import styled from 'styled-components/native';

export const Container = styled.View`
  width: 90%;
  border-width: 0.5px;
  border-color: gray;
  border-radius: 10px;
  padding: 6px;
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
