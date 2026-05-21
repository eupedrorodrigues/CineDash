export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthLoginResponse {
  token: string;
}
