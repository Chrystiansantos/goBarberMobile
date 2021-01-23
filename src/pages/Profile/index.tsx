import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import api from '../../services/api';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

import getValidationErros from '../../util/getValidationErros';
import { useAuth } from '../../Hooks/auth';

interface SignUpFormData {
  nome: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();
  const { user } = useAuth();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Senha mínimo 6 digitos'),
        });

        await schema.validate(data, {
          // abortEarly ira mostrar todos os erros,caso nao informe ele mostra apenas o primeiro
          abortEarly: false,
        });
        await api.post('/user', data);

        Alert.alert('Cadastro realizado com sucesso');
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais',
        );
      }
    },
    [navigation],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>
          <UserAvatarButton>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>
          <View>
            <Title>Meu perfil</Title>
          </View>
          <Form ref={formRef} onSubmit={handleSignUp}>
            <Input
              autoCorrect
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />

            <Input
              ref={emailInputRef}
              name="email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={oldPasswordInputRef}
              name="old_password"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Senha atual"
              returnKeyType="next"
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordInputRef}
              name="password"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Nova senha"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={confirmPasswordInputRef}
              name="password_confirmation"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Confirmar senha"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
