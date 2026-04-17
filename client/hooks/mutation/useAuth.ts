import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { apiFetch, setToken, getToken } from '@/lib/api';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

async function loginFn(credentials: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

async function registerFn(data: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthContext();
  
  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (data.data?.token && data.data.user) {
        setToken(data.data.token);
        login(data.data.token, data.data.user as User);
        router.push('/workspace');
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { login } = useAuthContext();
  
  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: registerFn,
    onSuccess: (data) => {
      if (data.data?.token && data.data.user) {
        setToken(data.data.token);
        login(data.data.token, data.data.user as User);
        router.push('/workspace');
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthContext();
  
  return () => {
    logout();
    router.push('/login');
  };
}

export function useAuth() {
  return !!getToken();
}

async function forgotPasswordFn(email: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async function resetPasswordFn(token: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function useForgotPassword() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: forgotPasswordFn,
  });
}

export function useResetPassword() {
  const router = useRouter();
  const { login } = useAuthContext();

  return useMutation<AuthResponse, Error, { token: string; password: string }>({
    mutationFn: ({ token, password }) => resetPasswordFn(token, password),
    onSuccess: (data) => {
      if (data.data?.token && data.data.user) {
        setToken(data.data.token);
        login(data.data.token, data.data.user as User);
        router.push('/workspace');
      }
    },
  });
}