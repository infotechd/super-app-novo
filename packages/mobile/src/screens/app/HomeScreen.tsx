import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeContainer } from '@/components/SafeContainer';
import { useAuth } from '@/hooks/useAuth';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      id: 'ofertas',
      title: 'Ver Ofertas',
      subtitle: 'Encontre as melhores ofertas',
      icon: 'pricetag-outline',
      color: THEME_CONFIG.COLORS.PRIMARY,
    },
    {
      id: 'servicos',
      title: 'Serviços',
      subtitle: 'Contrate prestadores',
      icon: 'construct-outline',
      color: THEME_CONFIG.COLORS.SECONDARY,
    },
    {
      id: 'anuncios',
      title: 'Anunciar',
      subtitle: 'Publique seus produtos',
      icon: 'megaphone-outline',
      color: THEME_CONFIG.COLORS.SUCCESS,
    },
    {
      id: 'perfil',
      title: 'Meu Perfil',
      subtitle: 'Gerencie sua conta',
      icon: 'person-outline',
      color: THEME_CONFIG.COLORS.INFO,
    },
  ];

  return (
    <SafeContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0]}!</Text>
            <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={THEME_CONFIG.COLORS.TEXT} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              Nenhuma atividade recente encontrada.
            </Text>
            <Text style={styles.activitySubtext}>
              Comece explorando as ofertas e serviços disponíveis!
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Ofertas Vistas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Serviços Contratados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Anúncios Criados</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME_CONFIG.SPACING.LG,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    marginTop: THEME_CONFIG.SPACING.XS,
  },
  notificationButton: {
    padding: THEME_CONFIG.SPACING.SM,
  },
  section: {
    marginBottom: THEME_CONFIG.SPACING.XL,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT,
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    padding: THEME_CONFIG.SPACING.LG,
    marginBottom: THEME_CONFIG.SPACING.MD,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT,
    textAlign: 'center',
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  actionSubtitle: {
    fontSize: 12,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    padding: THEME_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityText: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT,
    textAlign: 'center',
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  activitySubtext: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    padding: THEME_CONFIG.SPACING.LG,
    marginHorizontal: THEME_CONFIG.SPACING.XS,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  statLabel: {
    fontSize: 12,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});