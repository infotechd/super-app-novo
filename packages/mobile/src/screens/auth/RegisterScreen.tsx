import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller } from 'react-hook-form';
import { AuthStackParamList, RegisterFormData } from '@/types';
import { SafeContainer } from '@/components/SafeContainer';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { registerSchema } from '@/utils/validation';
import { formatPhone } from '@/utils/helpers';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    schema: registerSchema,
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      tipo: 'comprador' as const,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
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

          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </Text>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome Completo"
                placeholder="Digite seu nome completo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nome?.message}
                autoCapitalize="words"
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                  />
                }
              />
            )}
          />

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
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone (Opcional)"
                placeholder="(11) 99999-9999"
                value={value}
                onChangeText={(text) => onChange(formatPhone(text))}
                onBlur={onBlur}
                error={errors.telefone?.message}
                keyboardType="phone-pad"
                maxLength={15}
                leftIcon={
                  <Ionicons
                    name="call-outline"
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

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tipo de Usuário</Text>
            <Controller
              control={control}
              name="tipo"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerWrapper}>
                  <View style={styles.optionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        value === 'comprador' && styles.optionButtonSelected,
                        { marginRight: THEME_CONFIG.SPACING.SM }
                      ]}
                      onPress={() => onChange('comprador')}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        value === 'comprador' && styles.optionTextSelected
                      ]}>Comprador</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        value === 'prestador' && styles.optionButtonSelected,
                        { marginRight: THEME_CONFIG.SPACING.SM }
                      ]}
                      onPress={() => onChange('prestador')}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        value === 'prestador' && styles.optionTextSelected
                      ]}>Prestador de Serviço</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        value === 'anunciante' && styles.optionButtonSelected
                      ]}
                      onPress={() => onChange('anunciante')}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        value === 'anunciante' && styles.optionTextSelected
                      ]}>Anunciante</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>

          <Button
            title="Criar Conta"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid}
            fullWidth
            style={styles.registerButton}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
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
    paddingBottom: THEME_CONFIG.SPACING.LG,
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
  pickerContainer: {
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_CONFIG.COLORS.TEXT,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    backgroundColor: '#fff',
  },
  picker: {
    height: 48,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: THEME_CONFIG.SPACING.SM,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    paddingVertical: THEME_CONFIG.SPACING.SM,
    paddingHorizontal: THEME_CONFIG.SPACING.MD,
    backgroundColor: '#fff',
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  optionButtonSelected: {
    borderColor: THEME_CONFIG.COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: THEME_CONFIG.COLORS.PRIMARY,
  },
  registerButton: {
    marginTop: THEME_CONFIG.SPACING.LG,
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