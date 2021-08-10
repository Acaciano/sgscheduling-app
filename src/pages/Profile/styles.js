import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 140}px;
`;

export const Header = styled.View`
  padding: 4px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const ButtonSignOut = styled.TouchableOpacity`
  margin-left: auto;
  justify-content: center;
  align-items: center;
`;

export const HeaderTitlte = styled.Text`
  color: #f5ede8;
  font-size: 20px;
  text-align: center;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  margin-left: 80px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  margin: 24px 0;
`;

export const Avatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  margin-top: 34px;
  align-self: center;
  margin-bottom: 30px;
`;
