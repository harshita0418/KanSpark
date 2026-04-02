import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
}

async function searchUsers(query: string): Promise<User[]> {
  return apiFetch<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
  });
}