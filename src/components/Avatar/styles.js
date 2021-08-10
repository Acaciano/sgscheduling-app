import { Text, View } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const ContainerNoImage = styled.View`
  background: #ff9000;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const ContainerNoImageText = styled.Text`
  font-size: 14px;
  color: #28262e;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const ProfileButton = styled.TouchableOpacity``;
