import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { List } from '@/types/board';

async function fetchLists(boardId: string): Promise<List[]> {
  return apiFetch<List[]>(`/lists?boardId=${boardId}`);
}

export function useLists(boardId: string) {
  return useQuery({
    queryKey: ['lists', boardId],
    queryFn: () => fetchLists(boardId),
    enabled: !!boardId,
  });
}