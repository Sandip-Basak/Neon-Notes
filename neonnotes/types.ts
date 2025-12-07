export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ApiError {
  message: string;
  fieldErrors?: Record<string, string[]>;
}
