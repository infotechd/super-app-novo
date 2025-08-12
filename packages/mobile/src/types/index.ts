// Tipos do usuário
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: 'comprador' | 'prestador' | 'anunciante';
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos de autenticação
export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo: 'comprador' | 'prestador' | 'anunciante';
}

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Tipos de navegação
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Ofertas: undefined;
  Servicos: undefined;
  Perfil: undefined;
};

// Tipos de contexto
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Tipos de erro
export interface AppError {
  message: string;
  code?: string;
  field?: string;
}

// Tipos de formulário (aliases)
export type LoginFormData = LoginCredentials;
export type RegisterFormData = RegisterData;
