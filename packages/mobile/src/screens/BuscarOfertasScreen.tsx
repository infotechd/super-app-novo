import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Searchbar,
  Card,
  Button,
  Chip,
  FAB,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { ofertaService } from "../services/ofertaService";
import { OfertaServico } from "../types/oferta";

export default function BuscarOfertasScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [ofertas, setOfertas] = useState<OfertaServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categorias = [
    "Limpeza",
    "Reforma",
    "Tecnologia",
    "Educação",
    "Saúde",
    "Beleza",
    "Transporte",
    "Outros",
  ];

  useEffect(() => {
    loadOfertas();
  }, []);

  const loadOfertas = async () => {
    try {
      setLoading(true);
      const data = await ofertaService.buscarOfertas({
        search: searchQuery,
        categoria: selectedCategory ?? undefined,
      });
      setOfertas(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as ofertas");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOfertas();
    setRefreshing(false);
  };

  const handleSearch = () => {
    loadOfertas();
  };

  const renderOferta = ({ item }: { item: OfertaServico }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("OfferDetail", { oferta: item })}
    >
      <Card.Cover
        source={{ uri: item.imagens?.[0] || "https://via.placeholder.com/300x200" }}
      />
      <Card.Content>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
          <Chip mode="outlined" compact>
            {item.categoria}
          </Chip>
        </View>
        <Text style={styles.provider}>Por: {item.prestador?.nome}</Text>
      </Card.Content>
    </Card>
  );

  const renderCategoria = (categoria: string) => (
    <Chip
      key={categoria}
      mode={selectedCategory === categoria ? "flat" : "outlined"}
      selected={selectedCategory === categoria}
      onPress={() => {
        setSelectedCategory(selectedCategory === categoria ? null : categoria);
        loadOfertas();
      }}
      style={styles.categoryChip}
    >
      {categoria}
    </Chip>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} />
        <Text>Carregando ofertas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <Searchbar
        placeholder="Buscar serviços..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
      />

      {/* Filtros de categoria */}
      <FlatList
        data={categorias}
        renderItem={({ item }) => renderCategoria(item)}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      />

      {/* Lista de ofertas */}
      <FlatList
        data={ofertas}
        renderItem={renderOferta}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB para criar oferta (só para prestadores) */}
      {user?.tipoUsuario === "provider" && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate("Agenda", { screen: "OfertaServico" })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200EE",
  },
  provider: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
