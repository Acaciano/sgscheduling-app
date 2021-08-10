import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';


class AuthState {
    constructor(token, user) {
        this.token = token;
        this.user = user;
    }

    token;
    user;
}

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const organizationId = '44119C8E-2CE6-4310-9F99-8A1E728579B6';

    useEffect(() => {
        loadStoragedData();
    }, []);

    const loadStoragedData = async () => {
        const [token, user] = await AsyncStorage.multiGet([
            '@GoBarber:token',
            '@GoBarber:user'
        ]);

        if (token[1] && user[1]) {
            api.defaults.headers.authorization = `Bearer ${token[1]}`;
            setData({ token: token[1], user: JSON.parse(user[1]) })
        }

        setLoading(false);
    };


    const signIn = useCallback(async ({ email, password }) => {

        const response = await api.post('/v1/account/singIn', {
            email, password, organizationId
        });

        if (response && response.data && response.data.success) {
            const user = response.data.data;
            const auth = new AuthState(data.token, user);

            await AsyncStorage.multiSet(
                [
                    ['@GoBarber:token', user.token],
                    ['@GoBarber:user', JSON.stringify(auth.user)]
                ]
            );

            api.defaults.headers.authorization = `Bearer ${user.token}`;

            setData(auth);
        }
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(
            [
                '@GoBarber:token',
                '@GoBarber:user'
            ]
        );

        setData({});
    }, []);


    return (
        <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

function UserAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used whithin an AutProvider');
    }

    return context;
}

export { AuthProvider, UserAuth }
