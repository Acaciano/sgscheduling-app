import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreate from '../pages/AppointmentCreate';
import CreatedUser from '../pages/CreatedUser';
import MyAppointments from '../pages/MyAppointments';

const App = createStackNavigator();

const AuthRoutes = React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' }
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreate" component={AppointmentCreate} />
    <App.Screen name="CreatedUser" component={CreatedUser} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen name="MyAppointments" component={MyAppointments} />
  </App.Navigator>
);

export default AuthRoutes;


