import React from 'react';
import {TextInputProps} from 'react-native';

import {Container} from './styles';

const Input: React.FC<TextInputProps> = props => <Container {...props} />;

export default Input;
