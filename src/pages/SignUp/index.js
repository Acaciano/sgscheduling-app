import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FormHandles } from '@unform/core';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import * as Yup from 'yup';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';
import { Form } from '@unform/mobile';
import { useState } from 'react';


const SignUp = React.FC = () => {

  const formRef = useRef(null);
  const navigation = useNavigation();
  const emailInputRef = useRef(null);
  const cellPhoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { navigate } = useNavigation();

  const handleSignUp = useCallback(async (data) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().required('E-mail é obrigatório').email('Digite um e-mail vãlido!'),
        cellPhone: Yup.string().required('Celular é obrigatório'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        confirmPassword: Yup.string().required('Confirme a senha é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      if (data.password != data.confirmPassword) {
        Alert.alert(
          'Erro no cadastro',
          'A senha e confirmação de senha não conferem.'
        );
        return;
      }

      await api.post('/v1/person/singUp', data);

      navigate('CreatedUser');
    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        if (errors) formRef.current?.setErrors(errors);

        return;
      } else {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer seu cadastro, tente novamente!'
        );
      }
    }
    finally {
      setLoading(false);
    }
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Criar sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>

              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
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
                onSubmitEditing={() => {
                  cellPhoneInputRef.current?.focus()
                }}
              />

              <Input
                ref={cellPhoneInputRef}
                keyboardType="phone-pad"
                name="cellPhone"
                icon="phone"
                placeholder="Celular"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="confirmPassword"
                icon="lock"
                placeholder="Confirmar Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              {loading && (
                <Button onPress={() => { formRef.current?.submitForm() }}>Cadastrando...</Button>
              )}

              {!loading && (
                <Button onPress={() => { formRef.current?.submitForm() }}>Cadastrar</Button>
              )}

            </Form>

          </Container>
        </ScrollView>

        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#ff9000" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      </KeyboardAvoidingView>
    </>
  );
}

export default SignUp;
