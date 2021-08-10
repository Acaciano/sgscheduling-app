import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

const CreatedUser = React.FC = () => {
  const { navigate } = useNavigation();

  const handleOk = useCallback(() => {
    navigate('SignIn');
  }, []);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Cadastro concluído</Title>
      <Description>Agora é só fazer seu login.</Description>

      <OkButton onPress={handleOk}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default CreatedUser;
