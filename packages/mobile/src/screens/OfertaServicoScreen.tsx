// src/screens/OfertaServicoScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Chip, ActivityIndicator, IconButton, HelperText } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { ofertaService } from '../services/ofertaService';
import { uploadService } from '../services/uploadService';
import { OfertaServico } from '../types/oferta';
import * as ImagePicker from 'expo-image-picker';

export default function OfertaServicoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { ofertaId } = route.params as { ofertaId?: string };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form data
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categorias = [
    'Limpeza',
    'Reforma',
    'Tecnologia',
    'Educação',
    'Saúde',
    'Beleza',
    'Transporte',
    'Jardinagem',
    'Culinária',
    'Outros',
  ];

  useEffect(() => {
    if (ofertaId) {
      loadOferta();
    }
  }, [ofertaId]);

  const loadOferta = async () => {
    try {
      setLoading(true);
      const oferta = await ofertaService.buscarOfertaPorId(ofertaId!);

      setTitulo(oferta.titulo);
      setDescricao(oferta.descricao);
      setPreco(oferta.preco.toString());
      setCategoria(oferta.categoria);
      setInformacoesAdicionais(oferta.informacoesAdicionais || '');
      setImagens(oferta.imagens || []);
    } catch (error) {
      console.error('Erro ao carregar oferta:', error);
      Alert.alert('Erro', 'Não foi possível carregar a oferta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(Number(preco)) || Number(preco) <= 0) {
      newErrors.preco = 'Preço deve ser um número válido maior que zero';
    }

    if (!categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const ofertaData: Partial<OfertaServico> = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        preco: Number(preco),
        categoria,
        informacoesAdicionais: informacoesAdicionais.trim() || undefined,
        imagens,
        prestadorId: user!.id,
      };

      if (ofertaId) {
        await ofertaService.atualizarOferta(ofertaId, ofertaData);
        Alert.alert('Sucesso', 'Oferta atualizada com sucesso!');
      } else {
        await ofertaService.criarOferta(ofertaData);
        Alert.alert('Sucesso', 'Oferta criada com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
      Alert.alert('Erro', 'Não foi possível salvar a oferta');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar imagens');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        setUploadingImages(true);

        const uploadPromises = result.assets.map(async (asset) => {
          const uploadResult = await uploadService.uploadImage(asset.uri);
          return uploadResult.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        setImagens((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      Alert.alert('Erro', 'Não foi possível fazer upload das imagens');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color="#6200EE" />
        <Text style={styles.loadingText}>Carregando oferta...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Título */}
        <TextInput
          label="Título da Oferta *"
          value={titulo}
          onChangeText={setTitulo}
          mode="outlined"
          style={styles.input}
          error={!!errors.titulo}
        />
        <HelperText type="error" visible={!!errors.titulo}>
          {errors.titulo}
        </HelperText>

        {/* Descrição */}
        <TextInput
          label="Descrição *"
          value={descricao}
          onChangeText={setDescricao}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.descricao}
        />
        <HelperText type="error" visible={!!errors.descricao}>
          {errors.descricao}
        </HelperText>

        {/* Preço */}
        <TextInput
          label="Preço (R$) *"
          value={preco}
          onChangeText={setPreco}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.preco}
        />
        <HelperText type="error" visible={!!errors.preco}>
          {errors.preco}
        </HelperText>

        {/* Categoria */}
        <Text style={styles.sectionTitle}>Categoria *</Text>
        <View style={styles.categoriesContainer}>
          {categorias.map((cat) => (
            <Chip
              key={cat}
              mode={categoria === cat ? 'flat' : 'outlined'}
              selected={categoria === cat}
              onPress={() => setCategoria(cat)}
              style={styles.categoryChip}
            >
              {cat}
            </Chip>
          ))}
        </View>
        <HelperText type="error" visible={!!errors.categoria}>
          {errors.categoria}
        </HelperText>

        {/* Informações Adicionais */}
        <TextInput
          label="Informações Adicionais"
          value={informacoesAdicionais}
          onChangeText={setInformacoesAdicionais}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        {/* Imagens */}
        <Text style={styles.sectionTitle}>Imagens</Text>
        <View style={styles.imagesContainer}>
          {imagens.map((imagem, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imagem }} style={styles.image} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                <IconButton icon="close" size={16} iconColor="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addImageButton} onPress={handleImagePicker} disabled={uploadingImages}>
            {uploadingImages ? (
              <ActivityIndicator size={24} color="#6200EE" />
            ) : (
              <IconButton icon="plus" size={32} iconColor="#6200EE" />
            )}
            <Text style={styles.addImageText}>
              {uploadingImages ? 'Enviando...' : 'Adicionar Imagem'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton} disabled={saving}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton} loading={saving} disabled={saving}>
            {ofertaId ? 'Atualizar' : 'Criar'} Oferta
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6200EE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#6200EE',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});