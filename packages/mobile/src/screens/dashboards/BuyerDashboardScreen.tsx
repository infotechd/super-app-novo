import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BuyerDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Comprador</Text>
      <Text>Bem-vindo ao seu painel!</Text>
    </View>
  );
};

export default BuyerDashboardScreen;

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
