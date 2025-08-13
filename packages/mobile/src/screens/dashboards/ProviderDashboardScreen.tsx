import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProviderDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Prestador</Text>
      <Text>Gerencie seus serviços e ofertas.</Text>
    </View>
  );
};

export default ProviderDashboardScreen;

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
