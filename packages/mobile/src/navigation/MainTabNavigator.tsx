// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import BuscarOfertasScreen from '../screens/BuscarOfertasScreen';
//import AgendaScreen from "../screens/AgendaScreen";
//import ChatScreen from '../screens/ChatScreen';
//import CommunityScreen from '../screens/CommunityScreen';
import ProfileNavigator from './ProfileNavigator';

// Detail screens
import OfferDetailScreen from '../screens/OfferDetailScreen';
import OfertaServicoScreen from '../screens/OfertaServicoScreen';
//import ContratacaoScreen from '../screens/ContratacaoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para Home (ofertas)
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BuscarOfertas"
        component={BuscarOfertasScreen}
        options={{ title: 'Ofertas de Serviços' }}
      />
      <Stack.Screen
        name="OfferDetail"
        component={OfferDetailScreen}
        options={{ title: 'Detalhes da Oferta' }}
      />
        
      {/* <Stack.Screen
        name="Contratacao"
        component={ContratacaoScreen}
        options={{ title: 'Contratar Serviço' }}
      /> */}
    </Stack.Navigator>
  );
}

// Stack para Agenda
function AgendaStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="AgendaMain"
        component={AgendaScreen}
        options={{ title: 'Minha Agenda' }}
      /> */}
      <Stack.Screen
        name="OfertaServico"
        component={OfertaServicoScreen}
        options={{ title: 'Criar Oferta' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Agenda':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chat' : 'chat-outline';
              break;
            case 'Community':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Ofertas' }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaStack}
        options={{ tabBarLabel: 'Agenda' }}
      />
      {/* <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      /> */}
      {/* <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ tabBarLabel: 'Comunidade' }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}