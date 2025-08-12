import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller } from 'react-hook-form';
import { AuthStackParamList } from '@/types';
import { SafeContainer } from '@/components/SafeContainer';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { showSuccess, showInfo } = useToast();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simular envio de email de recuperação
    showInfo('Funcionalidade em desenvolvimento. Entre em contato com o suporte.');
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

          <Text style={styles.title}>Esqueceu a Senha?</Text>
          <Text style={styles.subtitle}>
            Digite seu email para receber instruções de recuperação
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

          <Button
            title="Enviar Instruções"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            fullWidth
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lembrou da senha?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Entrar
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
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: THEME_CONFIG.SPACING.LG,
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