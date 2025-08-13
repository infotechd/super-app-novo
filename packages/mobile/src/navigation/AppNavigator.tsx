import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '@/types';
import { HomeScreen } from '@/screens/app/HomeScreen';
import { OfertasScreen } from '@/screens/app/OfertasScreen';
import { ServicosScreen } from '@/screens/app/ServicosScreen';
import { PerfilScreen } from '@/screens/app/PerfilScreen';
import { THEME_CONFIG } from '@/constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Ofertas':
              iconName = focused ? 'pricetag' : 'pricetag-outline';
              break;
            case 'Servicos':
              iconName = focused ? 'construct' : 'construct-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME_CONFIG.COLORS.PRIMARY,
        tabBarInactiveTintColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen
        name="Ofertas"
        component={OfertasScreen}
        options={{ tabBarLabel: 'Ofertas' }}
      />
      <Tab.Screen
        name="Servicos"
        component={ServicosScreen}
        options={{ tabBarLabel: 'Serviços' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};