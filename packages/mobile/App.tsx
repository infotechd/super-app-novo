import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '@/context/AuthContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { THEME_CONFIG } from '@/constants/config';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <StatusBar
                        style="auto"
                        backgroundColor={THEME_CONFIG.COLORS.PRIMARY}
                    />
                    <RootNavigator />
                    <Toast />
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}