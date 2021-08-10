import React, { useCallback, useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';

import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Title, ForgotPasswordText, BackToSignIn, BackToSignInText } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';
import api from '../../services/api';


const ForgotPassword = React.FC = () => {

  const formRef = useRef(null);
  const navigation = useNavigation();

  const handleSubmit = useCallback(async (data) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório').email('Digite um e-mail vãlido!')
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('v1/account/forgotPassword', {
        email: data.email
      });

      Alert.alert('E-mail de recuperação senha!','Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada');

      navigation.navigate('SignIn');

    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        if (errors) formRef.current?.setErrors(errors);

        return;
      } else {

        Alert.alert(
          'Erro na redefinição da senha',
          'Ocorreu um erro ao fazer redefinição da senha, tente novamente.'
        );
      }
    }
  }, []);

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
              <Title>Recuperar senha</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>

              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => { formRef.current?.submitForm() }}>Recuperar</Button>
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

export default ForgotPassword;
