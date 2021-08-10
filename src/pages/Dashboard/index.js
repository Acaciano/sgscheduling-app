import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Platform } from "react-native";

import Icon from 'react-native-vector-icons/Feather';

import {
  Container, Header, HeaderTitle, MyAppointmentButton, MyAppointmentButtonText, ProfileButton, ProviderAvatar,
  ProviderContainer, ProviderInfo, ProviderMeta, ProviderMetaText,
  ProviderName, ProvidersList, ProvidersListTitle, UserName
}
  from './styles';

import { UserAuth } from '../../hooks/auth';
import api from '../../services/api';

import Avatar from '../../components/Avatar';
import { Config } from '../../enum/config';

import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';

const Dashboard = React.FC = () => {

  const { user, signOut } = UserAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    setLoading(true);
    api.get(`v1/person/providers/${user.id}`).then(response => {
      setProviders(response.data.data);
      setLoading(false);
    });

    OneSignal.getDeviceState().then((response) => {

      let deviceDataValue = new Object();

      deviceDataValue.personId = user ? user.id : '';
      deviceDataValue.deviceId = response.userId;
      deviceDataValue.system = Platform.OS;
      deviceDataValue.systemVersion = Platform.Version.toString();
      deviceDataValue.brand = DeviceInfo.getBrand();
      deviceDataValue.model = DeviceInfo.getDeviceId();
      deviceDataValue.appVersion = '0.1';

      if (deviceDataValue) {
        //api.post('/v1/person/device', deviceDataValue).then(() => {});
      }
    });

  }, [])

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback((providerId) => {
    navigate('CreateAppointment', { providerId });
  }, [navigate]);

  return (
    <Container>
      <Header>

        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
        <ProfileButton onPress={navigateToProfile}>
          <Avatar url_avatar={user.avatar} name={user.name} />
        </ProfileButton>
      </Header>

      <MyAppointmentButton onPress={() => { navigate('MyAppointments'); }}>
        <Icon name="calendar" size={14} color="#ff9000" />
        <MyAppointmentButtonText>Meus agendamentos</MyAppointmentButtonText>
      </MyAppointmentButton>

      <ProvidersList
        data={providers}
        keyExtractor={(provider) => provider.id}
        ListHeaderComponent={
          <>
            <ProvidersListTitle>{Config.ProvidersListTitle}</ProvidersListTitle>
            {loading && (
              <ActivityIndicator size="large" color="#ff9000" />
            )}
          </>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
            <ProviderAvatar>
              <Avatar url_avatar={provider.avatar} name={provider.name} />
            </ProviderAvatar>

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>{provider.workingDays}</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>{provider.workedHours}</ProviderMetaText>
              </ProviderMeta>

            </ProviderInfo>
          </ProviderContainer>
        )}
      />

    </Container>
  )
};

export default Dashboard;
