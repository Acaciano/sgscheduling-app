import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import {
  BackButton,
  Container,
  Header,
  HeaderTitle,
  HeaderTitlte,
  MyAppointmentButton,
  MyAppointmentButtonText,
  ProfileButton,
  ProviderAvatar,
  ProviderContainer,
  ProviderContainerNoRecord,
  ProviderInfo,
  ProviderInfoNoRecord,
  ProviderInfoNoRecordText,
  ProviderMeta,
  ProviderMetaText,
  ProviderName,
  ProvidersList,
  ProvidersListTitle,
  UserName,
} from './styles';

import { UserAuth } from '../../hooks/auth';
import api from '../../services/api';

import Avatar from '../../components/Avatar';

import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AppointmentStatus } from '../../enum/appointmentStatus';


const MyAppointments = React.FC = () => {
  const { user, signOut } = UserAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { goBack, navigate } = useNavigation();

  function loadData() {
    setLoading(true);

    api
      .get(`v1/appointment/me`)
      .then(response => {
        let appointmentData = response.data.data;

        appointmentData.map(item => {
          item.hourFormatted = format(parseISO(item.dateAppointment), 'HH:mm', {
            locale: ptBR,
          });

          item.dateAppointmentFormatted = format(
            parseISO(item.dateAppointment),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            },
          );

          item.today = isToday(parseISO(item.dateAppointment));
        });

        setAppointments(appointmentData);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const handleLeft = useCallback(id => {
    api.put(`v1/appointment/${id}/confirm`).then(() => {
      loadData();

      Alert.alert('Sucesso!', 'Agendamento confirmado com sucesso!')
    });
  }, []);

  const handleRight = useCallback(id => {
    api.delete(`v1/appointment/${id}`).then(() => {
      loadData();
    });
  }, []);

  function LeftActions({ progress, dragX, onPress, appointmentStatus }) {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    if (appointmentStatus == AppointmentStatus.Scheduled) {
      return (
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              { padding: 20, display: 'flex', marginTop: 22 },
              { transform: [{ scale: scale }] },
            ]}>
            <Icon name="check" size={30} color="#ff9000" />
            <Animated.Text style={[{ transform: [{ scale }] }]}></Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>

        </TouchableOpacity>
      );
    }
  }

  function RightActions({ progress, dragX, onPress, appointmentStatus }) {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    if (appointmentStatus == AppointmentStatus.Scheduled) {
      return (
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              { padding: 20, display: 'flex', marginTop: 22 },
              { transform: [{ scale: scale }] },
            ]}>
            <Icon name="trash" size={30} color="#ff9000" />
            <Animated.Text style={[{ transform: [{ scale }] }]}></Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>

        </TouchableOpacity>
      );
    }
  }

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            goBack();
          }}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitlte>Meus agendamentos</HeaderTitlte>

        <ProfileButton onPress={navigateToProfile}>
          <Avatar url_avatar={user.avatar} name={user.name} />
        </ProfileButton>
      </Header>

      {!loading && appointments.length <= 0 && (
        <ProviderContainerNoRecord onPress={() => { }}>
          <ProviderInfoNoRecord>
            <ProviderInfoNoRecordText>Nenhum agendamento</ProviderInfoNoRecordText>
          </ProviderInfoNoRecord>
        </ProviderContainerNoRecord>
      )}

      <ProvidersList
        data={appointments}
        keyExtractor={appointment => appointment.id}
        ListHeaderComponent={
          <>{loading && <ActivityIndicator size="large" color="#ff9000" />}</>
        }
        renderItem={({ item: appointment }) => (
          <Swipeable
            renderLeftActions={(progress, dragX) => (
              <LeftActions
                progress={progress}
                dragX={dragX}
                onPress={() => {
                  handleLeft(appointment.id);
                }}
                appointmentStatus={appointment.appointmentStatus}
              />
            )}
            renderRightActions={(progress, dragX) => (
              <RightActions
                progress={progress}
                dragX={dragX}
                onPress={() => {
                  handleRight(appointment.id);
                }}
                appointmentStatus={appointment.appointmentStatus}
              />
            )}>
            <ProviderContainer onPress={() => { }}>
              <ProviderAvatar>
                <Avatar
                  url_avatar={appointment.personUser.avatar}
                  name={appointment.personUser.name}
                />
              </ProviderAvatar>

              <ProviderInfo>
                <ProviderName>{appointment.personUser.name}</ProviderName>

                <ProviderMeta>
                  <Icon name="calendar" size={14} color="#ff9000" />

                  {appointment.today && (
                    <ProviderMetaText>
                      {' '}
                      Hoje, {appointment.dateAppointmentFormatted}
                    </ProviderMetaText>
                  )}

                  {!appointment.today && (
                    <ProviderMetaText>
                      {appointment.dateAppointmentFormatted}
                    </ProviderMetaText>
                  )}
                </ProviderMeta>

                <ProviderMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <ProviderMetaText>
                    {appointment.hourFormatted}
                  </ProviderMetaText>
                </ProviderMeta>

                {appointment.appointmentStatus == AppointmentStatus.Confirmed && (
                  <ProviderMeta>
                    <Icon name="check" size={14} color="#ff9000" />
                    <ProviderMetaText>
                      Confirmado
                    </ProviderMetaText>
                  </ProviderMeta>
                )}

              </ProviderInfo>
            </ProviderContainer>
          </Swipeable>
        )}
      />
    </Container>
  );
};

export default MyAppointments;
