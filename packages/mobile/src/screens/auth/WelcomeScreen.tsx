import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types';
import { SafeContainer } from '@/components/SafeContainer';
import { Button } from '@/components/Button';
import { THEME_CONFIG } from '@/constants/config';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bem-vindo ao Super App</Text>
          <Text style={styles.subtitle}>
            Conecte-se com prestadores de serviço, compradores e anunciantes
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Entrar"
            onPress={() => navigation.navigate('Login')}
            fullWidth
          />

          <Button
            title="Criar Conta"
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            fullWidth
            style={styles.registerButton}
          />
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: THEME_CONFIG.SPACING.XL,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttons: {
    paddingBottom: THEME_CONFIG.SPACING.XL,
  },
  registerButton: {
    marginTop: THEME_CONFIG.SPACING.MD,
    borderColor: '#fff',
  },
});