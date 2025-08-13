// src/screens/OfferDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Chip, Divider, IconButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ofertaService } from '../services/ofertaService';
import { OfertaServico } from '../types/oferta';

const { width } = Dimensions.get('window');

type HomeStackParamList = {
  BuscarOfertas: undefined;
  OfferDetail: { ofertaId: string };
  Contratacao: { ofertaId: string };
};

export default function OfferDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'OfferDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { user } = useAuth();
  const { ofertaId } = route.params;

  const [oferta, setOferta] = useState<OfertaServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadOferta();
  }, [ofertaId]);

  const loadOferta = async () => {
    try {
      setLoading(true);
      const data = await ofertaService.buscarOfertaPorId(ofertaId);
      setOferta(data);
    } catch (error) {
      console.error('Erro ao carregar oferta:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da oferta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleContratar = () => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para contratar este serviço');
      return;
    }

    if (user.tipoUsuario !== 'buyer') {
      Alert.alert('Acesso negado', 'Apenas compradores podem contratar serviços');
      return;
    }

    navigation.navigate('Contratacao', { ofertaId });
  };

  const handleChat = () => {
    // Implementar navegação para chat
    Alert.alert('Em breve', 'Funcionalidade de chat em desenvolvimento');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color="#6200EE" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!oferta) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oferta não encontrada</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Galeria de imagens */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {oferta.imagens?.map((imagem, index) => (
            <Image key={index} source={{ uri: imagem }} style={styles.image} resizeMode="cover" />
          )) || (
            <Image
              source={{ uri: 'https://via.placeholder.com/400x300?text=Sem+Imagem' }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </ScrollView>

        {oferta.imagens && oferta.imagens.length > 1 && (
          <View style={styles.imageIndicator}>
            <Text style={styles.imageCounter}>
              {currentImageIndex + 1} / {oferta.imagens.length}
            </Text>
          </View>
        )}
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Título e preço */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{oferta.titulo}</Text>
          <Text style={styles.price}>R$ {oferta.preco.toFixed(2)}</Text>
          <Chip mode="outlined" style={styles.categoryChip}>
            {oferta.categoria}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{oferta.descricao}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Informações do prestador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestador</Text>
          <View style={styles.providerContainer}>
            <Avatar.Image
              size={60}
              source={{
                uri: oferta.prestador?.avatar || 'https://via.placeholder.com/60x60?text=U',
              }}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{oferta.prestador?.nome}</Text>
              <View style={styles.ratingContainer}>
                <IconButton icon="star" size={16} iconColor="#FFD700" />
                <Text style={styles.rating}>
                  {oferta.prestador?.avaliacao?.toFixed(1) || 'N/A'}
                </Text>
                <Text style={styles.reviewCount}>
                  ({oferta.prestador?.totalAvaliacoes || 0} avaliações)
                </Text>
              </View>
              <Text style={styles.providerDescription}>
                {oferta.prestador?.descricao || 'Prestador de serviços'}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.locationContainer}>
            <IconButton icon="map-marker" size={20} iconColor="#6200EE" />
            <Text style={styles.location}>
              {oferta.localizacao?.endereco}, {oferta.localizacao?.cidade} - {oferta.localizacao?.estado}
            </Text>
          </View>
        </View>

        {/* Informações adicionais */}
        {oferta.informacoesAdicionais && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Adicionais</Text>
              <Text style={styles.additionalInfo}>{oferta.informacoesAdicionais}</Text>
            </View>
          </>
        )}
      </View>

      {/* Botões de ação */}
      <View style={styles.actionContainer}>
        <Button mode="outlined" onPress={handleChat} style={styles.chatButton} icon="chat">
          Conversar
        </Button>
        <Button
          mode="contained"
          onPress={handleContratar}
          style={styles.contractButton}
          disabled={user?.tipoUsuario !== 'buyer'}
        >
          Contratar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounter: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: -8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    marginLeft: -8,
  },
  additionalInfo: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  chatButton: {
    flex: 1,
  },
  contractButton: {
    flex: 2,
  },
});