import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdvertiserDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Anunciante</Text>
      <Text>Gerencie seus anúncios e campanhas.</Text>
    </View>
  );
};

export default AdvertiserDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});
