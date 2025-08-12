import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller } from 'react-hook-form';
import { AuthStackParamList, LoginFormData } from '@/types';
import { SafeContainer } from '@/components/SafeContainer';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { loginSchema } from '@/utils/validation';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { showError } = useToast();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={THEME_CONFIG.COLORS.TEXT} />
          </TouchableOpacity>

          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>
            Entre com sua conta para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Digite seu email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.senha?.message}
                secureTextEntry={!showPassword}
                autoComplete="password"
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                  />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          <Button
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não tem uma conta?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Criar conta
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
  },
  header: {
    paddingTop: THEME_CONFIG.SPACING.LG,
    paddingBottom: THEME_CONFIG.SPACING.XL,
  },
  backButton: {
    marginBottom: THEME_CONFIG.SPACING.LG,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: THEME_CONFIG.SPACING.XL,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: THEME_CONFIG.SPACING.LG,
  },
  footer: {
    paddingBottom: THEME_CONFIG.SPACING.LG,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  footerLink: {
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
});