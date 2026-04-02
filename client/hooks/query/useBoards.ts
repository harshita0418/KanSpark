import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Board } from '@/types/board';

async function fetchBoards(): Promise<Board[]> {
  return apiFetch<Board[]>('/boards');
}

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });
}