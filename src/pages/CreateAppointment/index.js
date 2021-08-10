import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { UserAuth } from '../../hooks/auth';
import api from '../../services/api';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Alert, Platform } from 'react-native';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Avatar from '../../components/Avatar';

import {
  BackButton, Calendar, Container, CreateAppointmentButton,
  CreateAppointmentButtonText, Header, HeaderTitlte, Hour,
  HourText, OpenDatePickerButton, OpenDatePickerButtonText,
  ProfileButton,
  ProviderAvatar, ProviderContainer, ProviderName, ProvidersList,
  ProvidersListContainer, Schedule, Section, SectionContent,
  SectionTitle, Title, BoxDatePickerButton
}
  from './styles';

var dateAppointment;

const CreateAppointment = React.FC = () => {

  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { user, signOut } = UserAuth();
  const { providerId } = route.params;

  const minimumDate = useMemo(() => {
    const today = new Date();

    if (today.getHours() >= 23) {
      return new Date(today.setDate(today.getDate() + 1));
    }

    return today;
  }, []);

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedDate, setSelectedDate] = useState(minimumDate);

  const [morningAvailability, setMorningAvailability] = useState([]);
  const [afternoonAppointments, setAfternoonAppointments] = useState([]);
  const [eveningAppointments, setEveningAppointments] = useState([]);
  const [hourDate, setHourDate] = useState();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ isDateTimePickerVisible: false });

  useEffect(() => {
    api.get(`v1/person/providers/${user.id}`).then(response => {
      setProviders(response.data.data);
    });
  }, []);

  useEffect(() => {
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();

    api.get(`v1/appointment/dateAvailability/${selectedProvider}/${year}/${month}/${day}`, {
    }).then(response => {
      const data = response.data.data;
      dateAppointment = undefined;

      setMorningAvailability(data.hours.filter((data) => { return data.typeHourAvailability == 1 }));
      setAfternoonAppointments(data.hours.filter((data) => { return data.typeHourAvailability == 2 }));
      setEveningAppointments(data.hours.filter((data) => { return data.typeHourAvailability == 3 }));
    })
  }, [selectedDate, selectedProvider]);

  const handlerSelectProvider = useCallback((id) => {
    setSelectedProvider(id);
  }, [selectedProvider]);

  const handlerDateChanged = useCallback((event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setSelectedDate(date);
  }, []);

  const handlerClickHour = useCallback((date) => {
    setHourDate(date);
    dateAppointment = date;
  }, [hourDate]);

  const handlerCreateAppointment = useCallback(async () => {
    try {

      if (dateAppointment == undefined) {
        Alert.alert(
          'Erro ao criar agendamento',
          'Informe um horário para o agendamento!'
        )
        return;
      }

      setLoading(true);

      const appointmentPayload = {
        dateAppointment: dateAppointment,
        clientId: user.id
      };

      await api.post(`v1/appointment/${selectedProvider}`,appointmentPayload);

      const date = new Date(dateAppointment.toString());

      navigate('AppointmentCreate', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente!'
      )
    } finally {
      setLoading(false);
    }
  }, [selectedProvider]);

  const selectedDateAsText = useMemo(() => {
    return format(
      selectedDate,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy",
      { locale: ptBR },
    );
  }, [selectedDate]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);


  const showDateTimePicker = () => {
    setState({ isDateTimePickerVisible: true });
  };

  const hideDateTimePicker = () => {
    setState({ isDateTimePickerVisible: false });
  };

  const handleDatePicked = date => {
    setSelectedDate(date);
    hideDateTimePicker();
  };

  return (
    <>
      <Header>
        <BackButton onPress={() => { goBack(); }}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitlte>Cabeleireiros</HeaderTitlte>

        <ProfileButton onPress={navigateToProfile}>
          <Avatar url_avatar={user.avatar} name={user.name} />
        </ProfileButton>
      </Header>

      <Container>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id == selectedProvider}
                onPress={() => { handlerSelectProvider(provider.id) }}
              >
                <ProviderAvatar source={{ uri: provider.avatar }} />
                <ProviderName selected={provider.id == selectedProvider}>{provider.name}</ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>{selectedDateAsText}</Title>
          <OpenDatePickerButton onPress={showDateTimePicker}>
            <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {/* {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              onChange={handlerDateChanged}
              textColor="white"
              value={selectedDate}
              minimumDate={minimumDate}
            />
          )} */}

          <DateTimePicker
            isVisible={state.isDateTimePickerVisible}
            onConfirm={handleDatePicked}
            onCancel={hideDateTimePicker}
            value={selectedDate}
            minimumDate={minimumDate}
          />

          <Schedule>
            <Title>Escolha o horário</Title>

            {morningAvailability && morningAvailability.length > 0 && (
              <Section>
                <SectionTitle>Manhã</SectionTitle>
                <SectionContent>

                  {morningAvailability && morningAvailability.length > 0 && morningAvailability.map((data) => (
                    <Hour
                      selected={data.date === hourDate}
                      onPress={() => handlerClickHour(data.date)}
                      available={data.available}
                      key={data.hourFormatted}>
                      <HourText selected={data.date === hourDate} >{data.hourFormatted}</HourText>
                    </Hour>
                  ))}
                </SectionContent>
              </Section>
            )}

            {afternoonAppointments && afternoonAppointments.length > 0 && (
              <Section>
                <SectionTitle>Tarde</SectionTitle>
                <SectionContent>
                  {afternoonAppointments && afternoonAppointments.map((data) => (
                    <Hour
                      selected={data.date === hourDate}
                      onPress={() => handlerClickHour(data.date)}
                      available={data.available}
                      key={data.hourFormatted}>
                      <HourText selected={data.date === hourDate} >{data.hourFormatted}</HourText>
                    </Hour>
                  ))}
                </SectionContent>
              </Section>
            )}

            {eveningAppointments && eveningAppointments.length > 0 && (
              <Section>
                <SectionTitle>Noite</SectionTitle>
                <SectionContent>
                  {eveningAppointments && eveningAppointments.map((data) => (
                    <Hour
                      selected={data.date === hourDate}
                      onPress={() => handlerClickHour(data.date)}
                      available={data.available}
                      key={data.hourFormatted}>
                      <HourText selected={data.date === hourDate} >{data.hourFormatted}</HourText>
                    </Hour>
                  ))}
                </SectionContent>
              </Section>
            )}

          </Schedule>


          <CreateAppointmentButton onPress={handlerCreateAppointment}>
            <CreateAppointmentButtonText>{loading ? 'Aguarde, agendando...' : 'Agendar'}</CreateAppointmentButtonText>
          </CreateAppointmentButton>

        </Calendar>
      </Container >
    </>
  )
};

export default CreateAppointment;
