import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Icon from 'react-native-vector-icons/Feather';

import * as Yup from 'yup';

import { UserAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, Avatar, BackButton, Header, HeaderTitlte, ButtonSignOut } from './styles';


const Profile = React.FC = () => {
  const { user, signOut } = UserAuth();
  const formRef = useRef(null);
  const navigation = useNavigation();

  const emailInputRef = useRef(null);

  const { navigate } = useNavigation();

  const handleSaveProfile = useCallback(async (data) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido')
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      Alert.alert(
        'Perfil atualizado com sucesso!',
        'As informações do perfil foram atualizadas.',
      );

      navigate('Dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
    }
  }, []);

  const handlerUpdateAvatar = useCallback(() => {

  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>

            <Header>
              <BackButton onPress={() => { navigate('Dashboard'); }}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>

              <HeaderTitlte>Meu Perfil</HeaderTitlte>

              <ButtonSignOut onPress={() => { signOut() }}>
                <Icon name="power" size={24} color="#999591" />
              </ButtonSignOut>

            </Header>

            <Avatar source={{ uri: user.avatar }} />

            <Form initialData={user} ref={formRef} onSubmit={handleSaveProfile}>
              <Input
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
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
