import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './Routes';

const App: React.FC = () => (
  // Sempre preciso utilizar esse navigationContainer por volta das rotas
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <View style={{ backgroundColor: '#312e38', flex: 1 }}>
      <Routes />
    </View>
  </NavigationContainer>
);

export default App;
