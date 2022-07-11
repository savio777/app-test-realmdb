import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  width: 100%;
  border-width: 1px;
  border-color: gray;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const ContentLeft = styled.View`
  width: 85%;
`;

export const ContentRight = styled.View`
  width: 15%;
  align-items: center;
  justify-content: space-around;
  padding-left: 5px;
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
