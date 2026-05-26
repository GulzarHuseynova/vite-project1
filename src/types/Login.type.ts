export type LoginForm = {
  email: string;
  password: string;
};
export interface Props {
  onLoginSuccess: () => void;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  title?: string;
}