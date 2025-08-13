// src/context/AppContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Types
interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: 'pt' | 'en' | 'es';
    notifications: {
        push: boolean;
        email: boolean;
        sms: boolean;
        marketing: boolean;
    };
    location: {
        enabled: boolean;
        city?: string;
        state?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    preferences: {
        currency: 'BRL' | 'USD' | 'EUR';
        distance: 'km' | 'miles';
        autoRefresh: boolean;
        cacheImages: boolean;
    };
}

interface AppState {
    isOnline: boolean;
    isLoading: boolean;
    lastSync?: string;
    unreadNotifications: number;
    activeFilters: {
        category?: string;
        priceRange?: {
            min: number;
            max: number;
        };
        location?: {
            city: string;
            radius: number;
        };
    };
}

interface AppContextData {
    // Estado da aplicação
    appState: AppState;
    settings: AppSettings;

    // Funções de configuração
    updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
    resetSettings: () => Promise<void>;

    // Funções de estado
    setLoading: (loading: boolean) => void;
    setUnreadNotifications: (count: number) => void;
    updateLastSync: () => void;

    // Funções de filtros
    setActiveFilters: (filters: Partial<AppState['activeFilters']>) => void;
    clearFilters: () => void;

    // Funções de conectividade
    checkConnectivity: () => Promise<boolean>;

    // Funções de cache
    clearCache: () => Promise<void>;
    getCacheSize: () => Promise<number>;

    // Funções de localização
    requestLocationPermission: () => Promise<boolean>;
    getCurrentLocation: () => Promise<{ latitude: number; longitude: number } | null>;

    // Funções utilitárias
    showMessage: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    formatCurrency: (value: number) => string;
    formatDistance: (value: number) => string;
}

// Configurações padrão
const defaultSettings: AppSettings = {
    theme: 'system',
    language: 'pt',
    notifications: {
        push: true,
        email: true,
        sms: false,
        marketing: false,
    },
    location: {
        enabled: false,
    },
    preferences: {
        currency: 'BRL',
        distance: 'km',
        autoRefresh: true,
        cacheImages: true,
    },
};

const defaultAppState: AppState = {
    isOnline: true,
    isLoading: false,
    unreadNotifications: 0,
    activeFilters: {},
};

// Context
const AppContext = createContext<AppContextData>({} as AppContextData);

// Hook para usar o contexto
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

// Provider Props
interface AppProviderProps {
    children: ReactNode;
}

// Provider Component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [appState, setAppState] = useState<AppState>(defaultAppState);
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);

    // Inicialização
    useEffect(() => {
        initializeApp();
        setupNetworkListener();
    }, []);

    // Inicializar aplicação
    const initializeApp = async () => {
        try {
            setLoading(true);

            // Carregar configurações salvas
            await loadSettings();

            // Verificar conectividade
            await checkConnectivity();

            // Carregar dados em cache se necessário
            await loadCachedData();

        } catch (error) {
            console.error('Erro na inicialização:', error);
            showMessage('Erro ao inicializar aplicação', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Configurar listener de rede
    const setupNetworkListener = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setAppState(prev => ({
                ...prev,
                isOnline: state.isConnected ?? false,
            }));

            if (state.isConnected && settings.preferences.autoRefresh) {
                // Auto-sync quando voltar online
                updateLastSync();
            }
        });

        return unsubscribe;
    };

    // Carregar configurações
    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('@super_app:settings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsedSettings });
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    };

    // Carregar dados em cache
    const loadCachedData = async () => {
        try {
            const cachedState = await AsyncStorage.getItem('@super_app:app_state');
            if (cachedState) {
                const parsedState = JSON.parse(cachedState);
                setAppState(prev => ({ ...prev, ...parsedState }));
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
        }
    };

    // Atualizar configurações
    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);

            await AsyncStorage.setItem(
                '@super_app:settings',
                JSON.stringify(updatedSettings)
            );

            showMessage('Configurações atualizadas', 'success');
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            showMessage('Erro ao salvar configurações', 'error');
        }
    };

    // Resetar configurações
    const resetSettings = async () => {
        try {
            setSettings(defaultSettings);
            await AsyncStorage.removeItem('@super_app:settings');
            showMessage('Configurações resetadas', 'success');
        } catch (error) {
            console.error('Erro ao resetar configurações:', error);
            showMessage('Erro ao resetar configurações', 'error');
        }
    };

    // Definir loading
    const setLoading = (loading: boolean) => {
        setAppState(prev => ({ ...prev, isLoading: loading }));
    };

    // Definir notificações não lidas
    const setUnreadNotifications = (count: number) => {
        setAppState(prev => ({ ...prev, unreadNotifications: count }));
    };

    // Atualizar última sincronização
    const updateLastSync = () => {
        const now = new Date().toISOString();
        setAppState(prev => ({ ...prev, lastSync: now }));

        // Salvar no cache
        AsyncStorage.setItem('@super_app:last_sync', now);
    };

    // Definir filtros ativos
    const setActiveFilters = (filters: Partial<AppState['activeFilters']>) => {
        setAppState(prev => ({
            ...prev,
            activeFilters: { ...prev.activeFilters, ...filters }
        }));
    };

    // Limpar filtros
    const clearFilters = () => {
        setAppState(prev => ({ ...prev, activeFilters: {} }));
    };

    // Verificar conectividade
    const checkConnectivity = async (): Promise<boolean> => {
        try {
            const netInfo = await NetInfo.fetch();
            const isConnected = netInfo.isConnected ?? false;

            setAppState(prev => ({ ...prev, isOnline: isConnected }));
            return isConnected;
        } catch (error) {
            console.error('Erro ao verificar conectividade:', error);
            return false;
        }
    };

    // Limpar cache
    const clearCache = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key =>
                key.startsWith('@super_app:cache_') ||
                key.startsWith('@super_app:temp_')
            );

            await AsyncStorage.multiRemove(cacheKeys);
            showMessage('Cache limpo com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
            showMessage('Erro ao limpar cache', 'error');
        }
    };

    // Obter tamanho do cache
    const getCacheSize = async (): Promise<number> => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key =>
                key.startsWith('@super_app:cache_') ||
                key.startsWith('@super_app:temp_')
            );

            let totalSize = 0;
            for (const key of cacheKeys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    totalSize += new Blob([value]).size;
                }
            }

            return totalSize;
        } catch (error) {
            console.error('Erro ao calcular tamanho do cache:', error);
            return 0;
        }
    };

    // Solicitar permissão de localização
    const requestLocationPermission = async (): Promise<boolean> => {
        try {
            // Implementar solicitação de permissão
            // Esta é uma implementação básica
            return true;
        } catch (error) {
            console.error('Erro ao solicitar permissão de localização:', error);
            return false;
        }
    };

    // Obter localização atual
    const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
        try {
            if (!settings.location.enabled) {
                return null;
            }

            // Implementar obtenção de localização
            // Esta é uma implementação básica
            return settings.location.coordinates || null;
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            return null;
        }
    };

    // Mostrar mensagem
    const showMessage = useCallback((
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info'
    ) => {
        // Implementar sistema de notificações/toasts
        Alert.alert(
            type === 'error' ? 'Erro' :
                type === 'warning' ? 'Atenção' :
                    type === 'success' ? 'Sucesso' : 'Informação',
            message
        );
    }, []);

    // Formatar moeda
    const formatCurrency = useCallback((value: number): string => {
        const { currency } = settings.preferences;

        const formatters = {
            BRL: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),
            USD: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
            EUR: new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR'
            }),
        };

        return formatters[currency].format(value);
    }, [settings.preferences.currency]);

    // Formatar distância
    const formatDistance = useCallback((value: number): string => {
        const { distance } = settings.preferences;

        if (distance === 'km') {
            return value < 1
                ? `${Math.round(value * 1000)}m`
                : `${value.toFixed(1)}km`;
        } else {
            const miles = value * 0.621371;
            return miles < 1
                ? `${Math.round(miles * 5280)}ft`
                : `${miles.toFixed(1)}mi`;
        }
    }, [settings.preferences.distance]);

    // Salvar estado no cache periodicamente
    useEffect(() => {
        const saveAppState = async () => {
            try {
                await AsyncStorage.setItem(
                    '@super_app:app_state',
                    JSON.stringify({
                        unreadNotifications: appState.unreadNotifications,
                        activeFilters: appState.activeFilters,
                        lastSync: appState.lastSync,
                    })
                );
            } catch (error) {
                console.error('Erro ao salvar estado:', error);
            }
        };

        const timer = setInterval(saveAppState, 30000); // Salvar a cada 30 segundos
        return () => clearInterval(timer);
    }, [appState]);

    // Valor do contexto
    const value: AppContextData = {
        appState,
        settings,
        updateSettings,
        resetSettings,
        setLoading,
        setUnreadNotifications,
        updateLastSync,
        setActiveFilters,
        clearFilters,
        checkConnectivity,
        clearCache,
        getCacheSize,
        requestLocationPermission,
        getCurrentLocation,
        showMessage,
        formatCurrency,
        formatDistance,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Hook personalizado para configurações
export const useAppSettings = () => {
    const { settings, updateSettings, resetSettings } = useApp();
    return { settings, updateSettings, resetSettings };
};

// Hook personalizado para estado da aplicação
export const useAppState = () => {
    const {
        appState,
        setLoading,
        setUnreadNotifications,
        updateLastSync
    } = useApp();

    return {
        appState,
        setLoading,
        setUnreadNotifications,
        updateLastSync
    };
};

// Hook personalizado para filtros
export const useFilters = () => {
    const {
        appState: { activeFilters },
        setActiveFilters,
        clearFilters
    } = useApp();

    return { activeFilters, setActiveFilters, clearFilters };
};

// Hook personalizado para utilitários
export const useAppUtils = () => {
    const {
        showMessage,
        formatCurrency,
        formatDistance,
        checkConnectivity,
        clearCache,
        getCacheSize
    } = useApp();

    return {
        showMessage,
        formatCurrency,
        formatDistance,
        checkConnectivity,
        clearCache,
        getCacheSize
    };
};

export default AppContext;