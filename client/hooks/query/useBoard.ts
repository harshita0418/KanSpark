import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Board } from '@/types/board';

async function fetchBoard(boardId: string): Promise<Board> {
  return apiFetch<Board>(`/boards/${boardId}`);
}

export function useBoard(boardId: string) {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
    enabled: !!boardId,
  });
}