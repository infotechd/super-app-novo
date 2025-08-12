import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeContainer } from '@/components/SafeContainer';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export const PerfilScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      subtitle: 'Altere suas informações pessoais',
      icon: 'person-outline',
      onPress: () => console.log('Editar perfil'),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Configure suas preferências',
      icon: 'notifications-outline',
      onPress: () => console.log('Notificações'),
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      subtitle: 'Gerencie sua privacidade',
      icon: 'shield-outline',
      onPress: () => console.log('Privacidade'),
    },
    {
      id: 'help',
      title: 'Ajuda',
      subtitle: 'Central de ajuda e suporte',
      icon: 'help-circle-outline',
      onPress: () => console.log('Ajuda'),
    },
    {
      id: 'about',
      title: 'Sobre',
      subtitle: 'Informações do aplicativo',
      icon: 'information-circle-outline',
      onPress: () => console.log('Sobre'),
    },
  ];

  return (
    <SafeContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.nome || 'Usuario')}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nome}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.userTypeContainer}>
              <Text style={styles.userType}>
                {user?.tipo === 'comprador' && 'Comprador'}
                {user?.tipo === 'prestador' && 'Prestador de Serviço'}
                {user?.tipo === 'anunciante' && 'Anunciante'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                />
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Sair da Conta"
            variant="outline"
            onPress={handleLogout}
            fullWidth
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Super App v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 Super App Team</Text>
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
  },
  header: {
    paddingVertical: THEME_CONFIG.SPACING.LG,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    padding: THEME_CONFIG.SPACING.LG,
    marginBottom: THEME_CONFIG.SPACING.LG,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME_CONFIG.SPACING.MD,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  userEmail: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  userTypeContainer: {
    alignSelf: 'flex-start',
  },
  userType: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME_CONFIG.COLORS.PRIMARY,
    backgroundColor: `${THEME_CONFIG.COLORS.PRIMARY}15`,
    paddingHorizontal: THEME_CONFIG.SPACING.SM,
    paddingVertical: THEME_CONFIG.SPACING.XS,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.SM,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    marginBottom: THEME_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME_CONFIG.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    marginRight: THEME_CONFIG.SPACING.MD,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_CONFIG.COLORS.TEXT,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  menuSubtitle: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  logoutSection: {
    marginBottom: THEME_CONFIG.SPACING.XL,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: THEME_CONFIG.SPACING.XL,
  },
  appInfoText: {
    fontSize: 12,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
});