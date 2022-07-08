import React from 'react';
import {TouchableOpacityProps} from 'react-native';

import {Container, Text} from './styles';

const Button: React.FC<TouchableOpacityProps> = ({children, ...rest}) => (
  <Container {...rest}>
    <Text>{children}</Text>
  </Container>
);

export default Button;
