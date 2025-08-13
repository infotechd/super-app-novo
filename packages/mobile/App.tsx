import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/styles/theme';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <AuthProvider>
                <AppProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                </AppProvider>
            </AuthProvider>
        </PaperProvider>
    );
}