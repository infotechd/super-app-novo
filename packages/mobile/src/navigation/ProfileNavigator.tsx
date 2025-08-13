// src/navigation/ProfileNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Dashboards por tipo de usuário
import BuyerDashboardScreen from '../screens/dashboards/BuyerDashboardScreen';
import ProviderDashboardScreen from '../screens/dashboards/ProviderDashboardScreen';
import AdvertiserDashboardScreen from '../screens/dashboards/AdvertiserDashboardScreen';

// Screens comuns (a serem adicionadas futuramente)
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import HelpScreen from '../screens/HelpScreen';

export type ProfileStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.tipoUsuario) {
      case 'buyer':
        return BuyerDashboardScreen;
      case 'provider':
        return ProviderDashboardScreen;
      case 'advertiser':
        return AdvertiserDashboardScreen;
      default:
        return BuyerDashboardScreen;
    }
  };

  const getDashboardTitle = () => {
    switch (user?.tipoUsuario) {
      case 'buyer':
        return 'Painel do Comprador';
      case 'provider':
        return 'Painel do Prestador';
      case 'advertiser':
        return 'Painel do Anunciante';
      default:
        return 'Meu Perfil';
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200EE' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardComponent}
        options={{ title: getDashboardTitle() }}
      />
      {/*
        Outras telas relacionadas ao perfil podem ser adicionadas aqui
        quando os componentes estiverem disponíveis.
        Exemplo:
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Editar Perfil' }} />
      */}
    </Stack.Navigator>
  );
}