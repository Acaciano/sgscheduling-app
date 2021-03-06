import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { UserAuth } from '../hooks/auth';

const Routes = () => {

    const { user, loading } = UserAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#999" />
            </View>
        );
    }

    return user ? <AppRoutes /> : <AuthRoutes />;
    //return <AuthRoutes />;
};

export default Routes;
