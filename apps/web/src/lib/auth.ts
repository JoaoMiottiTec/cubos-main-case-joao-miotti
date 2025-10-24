import { http } from './http';

export function saveToken(tok: string) {
  if (typeof window !== 'undefined') localStorage.setItem('token', tok);
}
export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
}

export async function login(email: string, password: string) {
  const { token, user } = await http.post<{
    token: string;
    user: { id: string; name: string; email: string };
  }>('/auth/login', { email, password });
  saveToken(token);
  return user;
}

export function logout() {
  clearToken();
}
