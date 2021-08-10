import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import CreatedUser from '../pages/CreatedUser';
import ForgetPassword from '../pages/ForgotPassword';

const Auth = createStackNavigator();

const AuthRoutes = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#312e38' }
        }}
    >
        <Auth.Screen name="SignIn" component={SignIn} />
        <Auth.Screen name="SignUp" component={SignUp} />
        <Auth.Screen name="ForgetPassword" component={ForgetPassword} />
        <Auth.Screen name="CreatedUser" component={CreatedUser} />

    </Auth.Navigator>
);

export default AuthRoutes;