import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeContainer } from '@/components/SafeContainer';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export const ServicosScreen: React.FC = () => {
  const serviceCategories = [
    { id: 'limpeza', name: 'Limpeza', icon: 'sparkles-outline' },
    { id: 'manutencao', name: 'Manutenção', icon: 'build-outline' },
    { id: 'beleza', name: 'Beleza', icon: 'cut-outline' },
    { id: 'educacao', name: 'Educação', icon: 'school-outline' },
    { id: 'saude', name: 'Saúde', icon: 'medical-outline' },
    { id: 'tecnologia', name: 'Tecnologia', icon: 'laptop-outline' },
  ];

  return (
    <SafeContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Serviços</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={24} color={THEME_CONFIG.COLORS.TEXT} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Service Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias de Serviços</Text>
            <View style={styles.categoriesGrid}>
              {serviceCategories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={THEME_CONFIG.COLORS.SECONDARY}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços Populares</Text>
            <View style={styles.emptyState}>
              <Ionicons
                name="construct-outline"
                size={64}
                color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
              />
              <Text style={styles.emptyTitle}>Nenhum serviço disponível</Text>
              <Text style={styles.emptySubtitle}>
                Os prestadores de serviço aparecerão aqui quando se cadastrarem
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT,
  },
  filterButton: {
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
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
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${THEME_CONFIG.COLORS.SECONDARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME_CONFIG.COLORS.TEXT,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: THEME_CONFIG.SPACING.XXL,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT,
    marginTop: THEME_CONFIG.SPACING.MD,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});