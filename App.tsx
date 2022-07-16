import React from 'react';
import FlashMessage from 'react-native-flash-message';

import Home from './src/screens/Home';

export default () => (
  <>
    <Home />
    <FlashMessage position="top" />
  </>
);
