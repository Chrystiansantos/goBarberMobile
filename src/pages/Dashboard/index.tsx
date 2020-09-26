import React from 'react';
import { Button, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// import { Container } from './styles';
import { useAuth } from '../../Hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button title="Sair" onPress={() => signOut()} />
    </View>
  );
};

export default Dashboard;
