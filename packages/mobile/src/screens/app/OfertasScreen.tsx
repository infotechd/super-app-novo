import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeContainer } from '@/components/SafeContainer';
import { THEME_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export const OfertasScreen: React.FC = () => {
  const categories = [
    { id: 'eletronicos', name: 'Eletrônicos', icon: 'phone-portrait-outline' },
    { id: 'roupas', name: 'Roupas', icon: 'shirt-outline' },
    { id: 'casa', name: 'Casa & Jardim', icon: 'home-outline' },
    { id: 'esportes', name: 'Esportes', icon: 'football-outline' },
    { id: 'livros', name: 'Livros', icon: 'book-outline' },
    { id: 'outros', name: 'Outros', icon: 'grid-outline' },
  ];

  return (
    <SafeContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ofertas</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={THEME_CONFIG.COLORS.TEXT} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={THEME_CONFIG.COLORS.PRIMARY}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured Offers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ofertas em Destaque</Text>
            <View style={styles.emptyState}>
              <Ionicons
                name="pricetag-outline"
                size={64}
                color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
              />
              <Text style={styles.emptyTitle}>Nenhuma oferta disponível</Text>
              <Text style={styles.emptySubtitle}>
                As ofertas aparecerão aqui quando estiverem disponíveis
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
  searchButton: {
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
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    padding: THEME_CONFIG.SPACING.MD,
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
    backgroundColor: `${THEME_CONFIG.COLORS.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  categoryName: {
    fontSize: 12,
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